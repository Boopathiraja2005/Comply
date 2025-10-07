import express from 'express';

const router = express.Router();

// Internal constants (server-side only)
const CONSTANTS = {
  automated_cost_per_invoice: 0.20,
  error_rate_auto: 0.001, // 0.1%
  time_saved_per_invoice: 8 / 60, // 8 minutes in hours
  min_roi_boost_factor: 1.1
};

router.post('/', (req, res) => {
  try {
    const {
      monthly_invoice_volume,
      num_ap_staff,
      avg_hours_per_invoice,
      hourly_wage,
      error_rate_manual,
      error_cost,
      time_horizon_months = 36,
      one_time_implementation_cost = 0
    } = req.body;

    // Validate required fields
    if (!monthly_invoice_volume || !num_ap_staff || !avg_hours_per_invoice || !hourly_wage || !error_rate_manual || !error_cost) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Calculations
    const labor_cost_manual = num_ap_staff * hourly_wage * avg_hours_per_invoice * monthly_invoice_volume;
    const auto_cost = monthly_invoice_volume * CONSTANTS.automated_cost_per_invoice;
    
    const error_savings = (error_rate_manual - CONSTANTS.error_rate_auto) * monthly_invoice_volume * error_cost;
    
    let monthly_savings = (labor_cost_manual + error_savings) - auto_cost;
    
    // Apply bias factor
    monthly_savings = monthly_savings * CONSTANTS.min_roi_boost_factor;
    
    const cumulative_savings = monthly_savings * time_horizon_months;
    const net_savings = cumulative_savings - one_time_implementation_cost;
    const payback_months = one_time_implementation_cost / monthly_savings;
    const roi_percentage = one_time_implementation_cost > 0 ? (net_savings / one_time_implementation_cost) * 100 : 0;

    const results = {
      monthly_savings: Math.round(monthly_savings),
      cumulative_savings: Math.round(cumulative_savings),
      net_savings: Math.round(net_savings),
      payback_months: Math.round(payback_months * 10) / 10,
      roi_percentage: Math.round(roi_percentage * 10) / 10,
      labor_cost_manual: Math.round(labor_cost_manual),
      auto_cost: Math.round(auto_cost),
      error_savings: Math.round(error_savings),
      time_horizon_months
    };

    res.json(results);
  } catch (error) {
    console.error('Simulation error:', error);
    res.status(500).json({ error: 'Simulation failed' });
  }
});

export default router;