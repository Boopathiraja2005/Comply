import express from 'express';
import PDFDocument from 'pdfkit';

const router = express.Router();

router.post('/generate', (req, res) => {
  try {
    const { email, scenarioData, results } = req.body;
    
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    // Create PDF
    const doc = new PDFDocument();
    const filename = `roi-report-${Date.now()}.pdf`;
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=${filename}`);
    
    doc.pipe(res);
    
    // PDF Content
    doc.fontSize(20).text('Invoicing Automation ROI Report', 100, 100);
    doc.fontSize(12).text(`Generated for: ${email}`, 100, 150);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 100, 170);
    
    doc.text('Input Parameters:', 100, 220);
    doc.text(`• Monthly Invoice Volume: ${scenarioData.monthly_invoice_volume}`, 120, 240);
    doc.text(`• AP Staff: ${scenarioData.num_ap_staff}`, 120, 260);
    doc.text(`• Hourly Wage: $${scenarioData.hourly_wage}`, 120, 280);
    doc.text(`• Hours per Invoice: ${scenarioData.avg_hours_per_invoice}`, 120, 300);
    doc.text(`• Manual Error Rate: ${(scenarioData.error_rate_manual * 100).toFixed(1)}%`, 120, 320);
    doc.text(`• Error Cost: $${scenarioData.error_cost}`, 120, 340);
    
    doc.text('ROI Results:', 100, 400);
    doc.text(`• Monthly Savings: $${results.monthly_savings.toLocaleString()}`, 120, 420);
    doc.text(`• Payback Period: ${results.payback_months} months`, 120, 440);
    doc.text(`• ROI (${results.time_horizon_months} months): ${results.roi_percentage}%`, 120, 460);
    doc.text(`• Cumulative Savings: $${results.cumulative_savings.toLocaleString()}`, 120, 480);
    
    doc.text('This report demonstrates significant cost savings through invoice automation.', 100, 540);
    
    doc.end();
  } catch (error) {
    console.error('Report generation error:', error);
    res.status(500).json({ error: 'Report generation failed' });
  }
});

export default router;