// Scenario model for in-memory storage
export class Scenario {
  constructor(data) {
    this.id = data.id;
    this.scenario_name = data.scenario_name;
    this.monthly_invoice_volume = data.monthly_invoice_volume;
    this.num_ap_staff = data.num_ap_staff;
    this.avg_hours_per_invoice = data.avg_hours_per_invoice;
    this.hourly_wage = data.hourly_wage;
    this.error_rate_manual = data.error_rate_manual;
    this.error_cost = data.error_cost;
    this.time_horizon_months = data.time_horizon_months;
    this.one_time_implementation_cost = data.one_time_implementation_cost;
    this.createdAt = data.createdAt;
    this.results = data.results;
  }
}