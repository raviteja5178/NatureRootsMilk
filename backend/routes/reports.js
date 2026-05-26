const express = require('express');
const router = express.Router();
const pool = require('../db/connection');

// Get customers deactivated in last month
router.get('/deactivated/last-month', async (req, res) => {
  try {
    const query = `
      SELECT c.id, c.name, c.email, c.phone, c.address, c.city, c.deactivated_at, v.name as vendor_name
      FROM customers c
      LEFT JOIN vendors v ON c.vendor_id = v.id
      WHERE c.status = 'deactivated' AND c.deactivated_at >= NOW() - INTERVAL '30 days'
      ORDER BY c.deactivated_at DESC
    `;
    const result = await pool.query(query);
    res.json({
      success: true,
      count: result.rows.length,
      data: result.rows,
    });
  } catch (err) {
    console.error('Error fetching deactivated customers:', err);
    res.status(500).json({ error: 'Failed to fetch deactivated customers' });
  }
});

// Get subscriptions in monthly range with totals
router.get('/subscriptions/monthly-range', async (req, res) => {
  try {
    const { start_date, end_date } = req.query;

    if (!start_date || !end_date) {
      return res.status(400).json({ error: 'start_date and end_date query parameters are required (YYYY-MM-DD format)' });
    }

    const query = `
      SELECT s.id, s.subscription_type, SUM(s.quantity) as total_quantity, 
             COUNT(DISTINCT s.customer_id) as customer_count, SUM(s.monthly_cost) as total_cost,
             s.start_date, s.end_date, s.status
      FROM subscriptions s
      WHERE s.start_date >= $1 AND s.start_date <= $2
      GROUP BY s.subscription_type, s.start_date, s.end_date, s.status
      ORDER BY s.start_date DESC
    `;
    const result = await pool.query(query, [start_date, end_date]);

    res.json({
      success: true,
      date_range: { start_date, end_date },
      count: result.rows.length,
      data: result.rows,
    });
  } catch (err) {
    console.error('Error fetching subscriptions in range:', err);
    res.status(500).json({ error: 'Failed to fetch subscriptions' });
  }
});

// Get vendor performance summary
router.get('/vendor/summary/:vendor_id', async (req, res) => {
  try {
    const { vendor_id } = req.params;

    const query = `
      SELECT 
        v.id, v.name, v.email, v.phone, v.city,
        COUNT(DISTINCT c.id) as total_customers,
        COUNT(DISTINCT CASE WHEN c.status = 'active' THEN c.id END) as active_customers,
        COUNT(DISTINCT CASE WHEN c.status = 'deactivated' THEN c.id END) as deactivated_customers,
        COUNT(DISTINCT s.id) as total_subscriptions,
        SUM(CASE WHEN s.status = 'active' THEN s.quantity ELSE 0 END) as total_quantity,
        SUM(CASE WHEN s.status = 'active' THEN s.monthly_cost ELSE 0 END) as monthly_revenue
      FROM vendors v
      LEFT JOIN customers c ON v.id = c.vendor_id
      LEFT JOIN subscriptions s ON c.id = s.customer_id
      WHERE v.id = $1
      GROUP BY v.id, v.name, v.email, v.phone, v.city
    `;
    const result = await pool.query(query, [vendor_id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Vendor not found' });
    }

    res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    console.error('Error fetching vendor summary:', err);
    res.status(500).json({ error: 'Failed to fetch vendor summary' });
  }
});

// Get all vendors analytics
router.get('/analytics/all-vendors', async (req, res) => {
  try {
    const query = `
      SELECT 
        v.id, v.name, v.email, v.city,
        COUNT(DISTINCT c.id) as total_customers,
        COUNT(DISTINCT CASE WHEN c.status = 'active' THEN c.id END) as active_customers,
        COUNT(DISTINCT CASE WHEN c.status = 'deactivated' AND c.deactivated_at >= NOW() - INTERVAL '30 days' THEN c.id END) as deactivated_last_month,
        COUNT(DISTINCT s.id) as total_subscriptions,
        SUM(CASE WHEN s.status = 'active' THEN s.quantity ELSE 0 END) as total_quantity,
        SUM(CASE WHEN s.status = 'active' THEN s.monthly_cost ELSE 0 END) as monthly_revenue
      FROM vendors v
      LEFT JOIN customers c ON v.id = c.vendor_id
      LEFT JOIN subscriptions s ON c.id = s.customer_id
      GROUP BY v.id, v.name, v.email, v.city
      ORDER BY monthly_revenue DESC NULLS LAST
    `;
    const result = await pool.query(query);

    res.json({
      success: true,
      vendor_count: result.rows.length,
      data: result.rows,
    });
  } catch (err) {
    console.error('Error fetching vendor analytics:', err);
    res.status(500).json({ error: 'Failed to fetch vendor analytics' });
  }
});

// Get customer full profile and details
router.get('/customer/:customer_id/details', async (req, res) => {
  try {
    const { customer_id } = req.params;

    const customerQuery = `
      SELECT c.*, v.name as vendor_name, v.email as vendor_email, v.phone as vendor_phone, v.city as vendor_city
      FROM customers c
      LEFT JOIN vendors v ON c.vendor_id = v.id
      WHERE c.id = $1
    `;
    const customerResult = await pool.query(customerQuery, [customer_id]);

    if (customerResult.rows.length === 0) {
      return res.status(404).json({ error: 'Customer not found' });
    }

    const subscriptionsQuery = `
      SELECT s.*, 
             (s.quantity * s.monthly_cost) as total_subscription_value
      FROM subscriptions s
      WHERE s.customer_id = $1
      ORDER BY s.created_at DESC
    `;
    const subscriptionsResult = await pool.query(subscriptionsQuery, [customer_id]);

    const customer = customerResult.rows[0];
    const totalActiveQuantity = subscriptionsResult.rows
      .filter(s => s.status === 'active')
      .reduce((sum, s) => sum + s.quantity, 0);
    const totalMonthlySpend = subscriptionsResult.rows
      .filter(s => s.status === 'active')
      .reduce((sum, s) => sum + parseFloat(s.monthly_cost), 0);

    res.json({
      success: true,
      data: {
        customer,
        subscriptions: subscriptionsResult.rows,
        summary: {
          total_subscriptions: subscriptionsResult.rows.length,
          active_subscriptions: subscriptionsResult.rows.filter(s => s.status === 'active').length,
          total_active_quantity: totalActiveQuantity,
          total_monthly_spend: totalMonthlySpend,
        },
      },
    });
  } catch (err) {
    console.error('Error fetching customer details:', err);
    res.status(500).json({ error: 'Failed to fetch customer details' });
  }
});

module.exports = router;
