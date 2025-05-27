import jsPDF from 'jspdf';
import 'jspdf-autotable';
import pptxgen from 'pptxgenjs';
import { TestPlan } from '../types';

export const exportService = {
  exportToPDF(testPlan: TestPlan): void {
    try {
      const doc = new jsPDF();
      
      // Title
      doc.setFontSize(20);
      doc.text('Test Plan', 105, 15, { align: 'center' });
      
      // Add content
      doc.setFontSize(12);
      let yPos = 30;
      
      // Context
      doc.setFontSize(16);
      doc.text('Context', 14, yPos);
      yPos += 10;
      doc.setFontSize(12);
      const contextLines = doc.splitTextToSize(testPlan.context, 180);
      doc.text(contextLines, 14, yPos);
      yPos += contextLines.length * 7 + 10;
      
      // Hypothesis
      if (yPos > 250) {
        doc.addPage();
        yPos = 20;
      }
      doc.setFontSize(16);
      doc.text('Hypothesis', 14, yPos);
      yPos += 10;
      doc.setFontSize(12);
      const hypothesisLines = doc.splitTextToSize(testPlan.hypothesis, 180);
      doc.text(hypothesisLines, 14, yPos);
      yPos += hypothesisLines.length * 7 + 10;
      
      // Expected Impact
      if (yPos > 250) {
        doc.addPage();
        yPos = 20;
      }
      doc.setFontSize(16);
      doc.text('Expected Impact', 14, yPos);
      yPos += 10;
      doc.setFontSize(12);
      doc.text(testPlan.expectedImpact, 14, yPos);
      yPos += 10;
      
      // Experiment Setup
      if (yPos > 250) {
        doc.addPage();
        yPos = 20;
      }
      doc.setFontSize(16);
      doc.text('Experiment Setup and Parameters', 14, yPos);
      yPos += 10;
      doc.setFontSize(12);
      doc.text(`Sample Size per Variant: ${testPlan.experimentSetup.sampleSize}`, 14, yPos);
      yPos += 7;
      doc.text(`Expected Duration: ${testPlan.experimentSetup.duration}`, 14, yPos);
      yPos += 7;
      doc.text(`Statistical Significance: ${testPlan.experimentSetup.significance}`, 14, yPos);
      yPos += 7;
      doc.text(`Statistical Power: ${testPlan.experimentSetup.power}`, 14, yPos);
      yPos += 15;
      
      // Metrics
      if (yPos > 250) {
        doc.addPage();
        yPos = 20;
      }
      doc.setFontSize(16);
      doc.text('Success Metrics', 14, yPos);
      yPos += 10;
      doc.setFontSize(12);
      doc.text(`Primary Success Metric: ${testPlan.metrics.primary}`, 14, yPos);
      yPos += 7;
      
      doc.text('Second-order metrics:', 14, yPos);
      yPos += 7;
      testPlan.metrics.secondaryMetrics.forEach(metric => {
        doc.text(`- ${metric}`, 14, yPos);
        yPos += 7;
      });
      
      yPos += 10;
      
      // Variants
      if (yPos > 250) {
        doc.addPage();
        yPos = 20;
      }
      doc.setFontSize(16);
      doc.text('Variants', 14, yPos);
      yPos += 10;
      
      doc.setFontSize(14);
      doc.text('Control', 14, yPos);
      yPos += 7;
      
      doc.setFontSize(12);
      const controlLines = doc.splitTextToSize(testPlan.variants.control, 180);
      doc.text(controlLines, 14, yPos);
      yPos += controlLines.length * 7 + 10;
      
      // Add control image if exists
      if (testPlan.variants.controlImage) {
        try {
          doc.addImage(testPlan.variants.controlImage, 'JPEG', 14, yPos, 80, 60);
          yPos += 70;
        } catch (e) {
          console.error('Failed to add control image to PDF', e);
        }
      }
      
      // Check if we need a new page
      if (yPos > 220) {
        doc.addPage();
        yPos = 20;
      }
      
      doc.setFontSize(14);
      doc.text('Variant A', 14, yPos);
      yPos += 7;
      
      doc.setFontSize(12);
      const variantALines = doc.splitTextToSize(testPlan.variants.variantA, 180);
      doc.text(variantALines, 14, yPos);
      yPos += variantALines.length * 7 + 10;
      
      // Add variant image if exists
      if (testPlan.variants.variantAImage) {
        try {
          doc.addImage(testPlan.variants.variantAImage, 'JPEG', 14, yPos, 80, 60);
        } catch (e) {
          console.error('Failed to add variant image to PDF', e);
        }
      }
      
      // Save the PDF
      doc.save('test-plan.pdf');
    } catch (error) {
      console.error('Error exporting PDF:', error);
      alert('Failed to export PDF. Please try again.');
    }
  },
  
  exportToSlides(testPlan: TestPlan): void {
    try {
      const pptx = new pptxgen();
      
      // Title slide
      let slide = pptx.addSlide();
      slide.addText('Test Plan', { x: 1, y: 1, w: 8, h: 1, fontSize: 24, bold: true });
      
      // Context slide
      slide = pptx.addSlide();
      slide.addText('Context', { x: 0.5, y: 0.5, w: 9, h: 0.5, fontSize: 18, bold: true });
      slide.addText(testPlan.context || 'No context provided', { x: 0.5, y: 1.2, w: 9, h: 4, fontSize: 14 });
      
      // Hypothesis slide
      slide = pptx.addSlide();
      slide.addText('Hypothesis', { x: 0.5, y: 0.5, w: 9, h: 0.5, fontSize: 18, bold: true });
      slide.addText(testPlan.hypothesis || 'No hypothesis provided', { x: 0.5, y: 1.2, w: 9, h: 4, fontSize: 14 });
      
      // Expected Impact slide
      slide = pptx.addSlide();
      slide.addText('Expected Impact', { x: 0.5, y: 0.5, w: 9, h: 0.5, fontSize: 18, bold: true });
      slide.addText(testPlan.expectedImpact || 'No impact estimate provided', { x: 0.5, y: 1.2, w: 9, h: 4, fontSize: 14 });
      
      // Experiment Setup slide
      slide = pptx.addSlide();
      slide.addText('Experiment Setup and Parameters', { x: 0.5, y: 0.5, w: 9, h: 0.5, fontSize: 18, bold: true });
      
      const setupData = [
        ['Parameter', 'Value'],
        ['Sample Size per Variant', testPlan.experimentSetup.sampleSize || 'Not specified'],
        ['Expected Duration', testPlan.experimentSetup.duration || 'Not specified'],
        ['Statistical Significance', testPlan.experimentSetup.significance || '95%'],
        ['Statistical Power', testPlan.experimentSetup.power || '80%']
      ];
      
      slide.addTable(setupData, { x:.5, y: 1.2, w: 9, h: 2, fontSize: 14 });
      
      // Metrics slide
      slide = pptx.addSlide();
      slide.addText('Success Metrics', { x: 0.5, y: 0.5, w: 9, h: 0.5, fontSize: 18, bold: true });
      
      slide.addText('Primary Success Metric:', { x: 0.5, y: 1.2, w: 9, h: 0.3, fontSize: 14, bold: true });
      slide.addText(testPlan.metrics.primary || 'Not defined', { x: 0.5, y: 1.5, w: 9, h: 0.3, fontSize: 14 });
      
      slide.addText('Second-order metrics:', { x: 0.5, y: 2.0, w: 9, h: 0.3, fontSize: 14, bold: true });
      let yPos = 2.3;
      
      if (testPlan.metrics.secondaryMetrics && testPlan.metrics.secondaryMetrics.length > 0) {
        testPlan.metrics.secondaryMetrics.forEach(metric => {
          slide.addText(`• ${metric}`, { x: 0.7, y: yPos, w: 8.8, h: 0.3, fontSize: 14 });
          yPos += 0.3;
        });
      } else {
        slide.addText('• No secondary metrics defined', { x: 0.7, y: yPos, w: 8.8, h: 0.3, fontSize: 14 });
      }
      
      // Variants slide - Control
      slide = pptx.addSlide();
      slide.addText('Variants - Control', { x: 0.5, y: 0.5, w: 9, h: 0.5, fontSize: 18, bold: true });
      slide.addText(testPlan.variants.control || 'No control variant described', { x: 0.5, y: 1.2, w: 9, h: 2, fontSize: 14 });
      
      // Add control image if exists
      if (testPlan.variants.controlImage) {
        try {
          // For base64 images
          const imageData = testPlan.variants.controlImage.split(',');
          if (imageData.length > 1) {
            slide.addImage({ 
              data: imageData[1], 
              x: 0.5, 
              y: 3.5, 
              w: 4, 
              h: 3 
            });
          }
        } catch (e) {
          console.error('Failed to add control image to slides', e);
          slide.addText('(Image could not be added)', { x: 0.5, y: 3.5, w: 9, h: 0.3, fontSize: 12, italic: true, color: '888888' });
        }
      }
      
      // Variants slide - Variant A
      slide = pptx.addSlide();
      slide.addText('Variants - Test Version', { x: 0.5, y: 0.5, w: 9, h: 0.5, fontSize: 18, bold: true });
      slide.addText(testPlan.variants.variantA || 'No test variant described', { x: 0.5, y: 1.2, w: 9, h: 2, fontSize: 14 });
      
      // Add variant image if exists
      if (testPlan.variants.variantAImage) {
        try {
          // For base64 images
          const imageData = testPlan.variants.variantAImage.split(',');
          if (imageData.length > 1) {
            slide.addImage({ 
              data: imageData[1], 
              x: 0.5, 
              y: 3.5, 
              w: 4, 
              h: 3 
            });
          }
        } catch (e) {
          console.error('Failed to add variant image to slides', e);
          slide.addText('(Image could not be added)', { x: 0.5, y: 3.5, w: 9, h: 0.3, fontSize: 12, italic: true, color: '888888' });
        }
      }
      
      // Save the presentation - with error handling
      try {
        pptx.writeFile({ fileName: 'test-plan.pptx' })
          .catch(err => {
            console.error('Error saving PPTX:', err);
            alert('Failed to export slides. Please try again.');
          });
      } catch (e) {
        console.error('Exception during PPTX export:', e);
        alert('Failed to export slides. Please try again.');
      }
    } catch (error) {
      console.error('Error creating presentation:', error);
      alert('Failed to create presentation. Please try again.');
    }
  }
};