import { jsPDF } from 'jspdf';
import { TriageResult, SOAPNote, TreatmentPlanResult, PostOpInstruction } from '../types';

// Helper to wrap text and return next Y position, auto-adding pages if needed
function addWrappedText(
  doc: jsPDF,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number = 6
): number {
  const lines = doc.splitTextToSize(text, maxWidth);
  for (let i = 0; i < lines.length; i++) {
    if (y > 275) {
      doc.addPage();
      drawPageDecorations(doc, 'PAGE_CONTINUED');
      y = 30; // Margin top for new page
    }
    doc.text(lines[i], x, y);
    y += lineHeight;
  }
  return y;
}

// Draw professional clinical headers and footer borders
function drawHeader(doc: jsPDF, title: string, category: string) {
  // Brand background bar
  doc.setFillColor(15, 23, 42); // slate-900
  doc.rect(0, 0, 210, 40, 'F');

  // Brand text
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(20);
  doc.text('DentaCare AI', 15, 18);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(148, 163, 184); // slate-400
  doc.text('Clinical & Patient Dental Intelligence Portal', 15, 26);

  // Document title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(59, 130, 246); // blue-500
  doc.text(title.toUpperCase(), 195, 18, { align: 'right' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(203, 213, 225); // slate-300
  doc.text(category, 195, 26, { align: 'right' });

  // Safety indicator strip
  doc.setFillColor(59, 130, 246); // blue-500
  doc.rect(0, 40, 210, 2, 'F');
}

function drawPageDecorations(doc: jsPDF, mode: string = '') {
  // Footer rule
  doc.setDrawColor(226, 232, 240); // slate-200
  doc.setLineWidth(0.5);
  doc.line(15, 280, 195, 280);

  // Disclaimer & branding
  doc.setFont('helvetica', 'oblique');
  doc.setFontSize(7);
  doc.setTextColor(100, 116, 139); // slate-500
  const disclaimer = 'Disclaimer: AI-generated clinical assistance report. Verify with a licensed dentist before medical action.';
  doc.text(disclaimer, 15, 285);
  doc.text('www.dentacare.ai', 195, 285, { align: 'right' });
}

export const downloadTriagePDF = (data: TriageResult, toothNum?: number | null) => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  drawHeader(doc, 'AI Dental Triage', 'Patient Symptom Assessment');
  drawPageDecorations(doc);

  let y = 55;

  // Title block
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(15, 23, 42); // slate-900
  doc.text('Dental Symptom & Urgency Triage Report', 15, y);
  y += 5;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(100, 116, 139);
  doc.text(`Generated on: ${new Date().toLocaleDateString()} | Tooth Number: ${toothNum ? '#' + toothNum : 'General Jaw Pain'}`, 15, y);
  y += 10;

  // Urgency Block
  const urgencyColor = data.urgency === 'EMERGENCY' ? [225, 29, 72] : data.urgency === 'PROMPT' ? [217, 119, 6] : [13, 148, 136];
  doc.setFillColor(urgencyColor[0], urgencyColor[1], urgencyColor[2]);
  doc.rect(15, y, 180, 10, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(255, 255, 255);
  doc.text(`URGENCY LEVEL: ${data.urgency} CARE REQUIRED`, 20, y + 6.5);
  y += 15;

  // Reason
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(15, 23, 42);
  doc.text('Urgency Reason & Summary:', 15, y);
  y += 6;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(51, 65, 85);
  y = addWrappedText(doc, data.urgencyReason, 15, y, 180, 5.5);
  y += 8;

  // Potential Conditions
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(15, 23, 42);
  doc.text('Potential Clinical Conditions:', 15, y);
  y += 6;

  data.potentialConditions.forEach((cond) => {
    // Small background card
    doc.setFillColor(248, 250, 252); // slate-50
    doc.setDrawColor(241, 245, 249); // slate-100
    doc.rect(15, y, 180, 16, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(30, 41, 59);
    doc.text(`${cond.name} (${cond.likelihood} Likelihood)`, 18, y + 5);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(71, 85, 105);
    addWrappedText(doc, cond.description, 18, y + 10, 174, 4.5);
    y += 20;
  });

  // Keep Y safe
  if (y > 220) {
    doc.addPage();
    drawPageDecorations(doc);
    y = 30;
  }

  // Safe Home Care Actions
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(15, 23, 42);
  doc.text('Recommended Immediate Safe Home Actions:', 15, y);
  y += 6;

  data.immediateActions.forEach((act) => {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(16, 185, 129); // emerald-500
    doc.text('•', 15, y);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9.5);
    doc.setTextColor(51, 65, 85);
    y = addWrappedText(doc, act, 20, y, 175, 5);
    y += 1.5;
  });

  y += 6;

  if (y > 220) {
    doc.addPage();
    drawPageDecorations(doc);
    y = 30;
  }

  // What to Avoid
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(225, 29, 72); // rose-600
  doc.text('CRITICAL: Things to Avoid Right Now:', 15, y);
  y += 6;

  data.whatToAvoid.forEach((avoid) => {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(225, 29, 72);
    doc.text('•', 15, y);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9.5);
    doc.setTextColor(51, 65, 85);
    y = addWrappedText(doc, avoid, 20, y, 175, 5);
    y += 1.5;
  });

  y += 6;

  if (y > 220) {
    doc.addPage();
    drawPageDecorations(doc);
    y = 30;
  }

  // Questions for Dentist
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(15, 23, 42);
  doc.text('Questions to Ask Your Dentist:', 15, y);
  y += 6;

  data.questionsForDentist.forEach((q, idx) => {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.setTextColor(59, 130, 246);
    doc.text(`Q${idx + 1}:`, 15, y);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9.5);
    doc.setTextColor(51, 65, 85);
    y = addWrappedText(doc, q, 22, y, 173, 5);
    y += 1;
  });

  doc.save(`DentaCare_Triage_Report_Tooth_${toothNum || 'General'}.pdf`);
};

export const downloadSoapPDF = (data: SOAPNote, toothNumbers?: string) => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  drawHeader(doc, 'SOAP Note', 'Clinical EHR Documentation');
  drawPageDecorations(doc);

  let y = 55;

  // Header Title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(15, 23, 42);
  doc.text('Formatted EHR Clinical Chart Note', 15, y);
  y += 5;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(100, 116, 139);
  doc.text(`Generated on: ${new Date().toLocaleDateString()} | Affected Teeth: ${toothNumbers || 'N/A'}`, 15, y);
  y += 10;

  // Grid for Subjective / Objective / Assessment / Plan
  const sections = [
    { title: 'SUBJECTIVE (S)', content: data.subjective },
    { title: 'OBJECTIVE (O)', content: data.objective },
    { title: 'ASSESSMENT (A)', content: data.assessment },
    { title: 'PLAN (P)', content: data.plan },
  ];

  sections.forEach((sec) => {
    if (y > 240) {
      doc.addPage();
      drawPageDecorations(doc);
      y = 30;
    }

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10.5);
    doc.setTextColor(79, 70, 229); // indigo-600
    doc.text(sec.title, 15, y);
    y += 5;

    // Small boundary box for elegance
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.3);
    const textLines = doc.splitTextToSize(sec.content, 172);
    const boxHeight = textLines.length * 5 + 6;

    doc.setFillColor(250, 250, 250);
    doc.rect(15, y, 180, boxHeight, 'FD');

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9.5);
    doc.setTextColor(30, 41, 59);
    y = addWrappedText(doc, sec.content, 19, y + 5, 172, 5);
    y += 10; // Extra padding
  });

  if (y > 220) {
    doc.addPage();
    drawPageDecorations(doc);
    y = 30;
  }

  // CDT Codes Billing Block
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(15, 23, 42);
  doc.text('Recommended CDT Treatment Codes:', 15, y);
  y += 6;

  data.cdtCodes.forEach((code) => {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(79, 70, 229); // indigo-600
    doc.text(code.code, 15, y);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9.5);
    doc.setTextColor(51, 65, 85);
    doc.text(code.title, 32, y);

    if (code.feeEst) {
      doc.setFont('helvetica', 'bold');
      doc.text(`$${code.feeEst}`, 195, y, { align: 'right' });
    }
    y += 6.5;
  });

  y += 10;

  if (data.doctorSignaturePrompt) {
    if (y > 260) {
      doc.addPage();
      drawPageDecorations(doc);
      y = 30;
    }
    doc.setFont('helvetica', 'oblique');
    doc.setFontSize(9);
    doc.setTextColor(148, 163, 184);
    doc.text(data.doctorSignaturePrompt, 105, y, { align: 'center' });
  }

  doc.save(`EHR_Clinical_SOAP_Note_${toothNumbers || 'Chart'}.pdf`);
};

export const downloadTreatmentPlanPDF = (data: TreatmentPlanResult) => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  drawHeader(doc, 'Treatment Plan', 'Cost Estimate & Roadmap');
  drawPageDecorations(doc);

  let y = 55;

  // Title block
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(15, 23, 42);
  doc.text('Dental Treatment Plan & Cost Estimate', 15, y);
  y += 5;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(100, 116, 139);
  doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 15, y);
  y += 10;

  // Summary box
  doc.setFillColor(243, 244, 246);
  doc.rect(15, y, 180, 22, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(79, 70, 229);
  doc.text('Patient Case Summary:', 18, y + 6);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(51, 65, 85);
  addWrappedText(doc, data.patientSummary, 18, y + 11, 174, 4.5);
  y += 28;

  // Table header
  doc.setFillColor(15, 23, 42);
  doc.rect(15, y, 180, 8, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(255, 255, 255);
  doc.text('Tooth / CDT', 17, y + 5.5);
  doc.text('Procedure Name', 45, y + 5.5);
  doc.text('Priority', 115, y + 5.5);
  doc.text('Fee', 145, y + 5.5);
  doc.text('Ins. Est', 165, y + 5.5);
  doc.text('Patient', 185, y + 5.5);
  y += 8;

  // Table items
  data.items.forEach((item, index) => {
    if (y > 240) {
      doc.addPage();
      drawPageDecorations(doc);
      y = 30;
    }

    // Zebra striping
    if (index % 2 === 0) {
      doc.setFillColor(249, 250, 251);
      doc.rect(15, y, 180, 8, 'F');
    }

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(79, 70, 229);
    doc.text(item.toothNumber ? `#${item.toothNumber} (${item.cdtCode})` : `Gen (${item.cdtCode})`, 17, y + 5.5);

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(51, 65, 85);
    const nameLimit = item.procedureName.length > 38 ? item.procedureName.substring(0, 36) + '...' : item.procedureName;
    doc.text(nameLimit, 45, y + 5.5);

    doc.text(item.priority, 115, y + 5.5);
    doc.text(`$${item.estimatedCost}`, 145, y + 5.5);
    doc.setTextColor(16, 185, 129);
    doc.text(`-$${item.estimatedInsuranceCoverage}`, 165, y + 5.5);

    doc.setFont('helvetica', 'bold');
    doc.setTextColor(15, 23, 42);
    const patientFee = Math.max(0, item.estimatedCost - item.estimatedInsuranceCoverage);
    doc.text(`$${patientFee}`, 185, y + 5.5);

    y += 8;
  });

  y += 8;

  if (y > 230) {
    doc.addPage();
    drawPageDecorations(doc);
    y = 30;
  }

  // Cost total card box
  doc.setFillColor(15, 23, 42);
  doc.rect(15, y, 180, 20, 'F');

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(203, 213, 225);
  doc.text(`Total Estimated Procedure Fees: $${data.totalCost}`, 20, y + 8);
  doc.text(`Est. Insurance Contribution: -$${data.estInsurance}`, 20, y + 14);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(96, 165, 250); // blue-400
  doc.text('Estimated Out-of-Pocket:', 115, y + 12);
  doc.setFontSize(16);
  doc.setTextColor(255, 255, 255);
  doc.text(`$${data.outOfPocket}`, 190, y + 13.5, { align: 'right' });

  doc.save('DentaCare_Treatment_Financial_Plan.pdf');
};

export const downloadPostOpPDF = (data: PostOpInstruction) => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  drawHeader(doc, 'Recovery Guide', 'Post-Procedure Oral Instructions');
  drawPageDecorations(doc);

  let y = 55;

  // Document title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(15);
  doc.setTextColor(15, 23, 42);
  doc.text(data.title, 15, y);
  y += 5;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.setTextColor(100, 116, 139);
  doc.text(`Category: ${data.category} Care | Date Generated: ${new Date().toLocaleDateString()}`, 15, y);
  y += 12;

  // DO List
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11.5);
  doc.setTextColor(16, 185, 129); // emerald-500
  doc.text('RECOMMENDED CARE (DO):', 15, y);
  y += 6;

  data.doList.forEach((item) => {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.text('✓', 15, y);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9.5);
    doc.setTextColor(51, 65, 85);
    y = addWrappedText(doc, item, 22, y, 173, 5);
    y += 1.5;
  });

  y += 6;

  if (y > 220) {
    doc.addPage();
    drawPageDecorations(doc);
    y = 30;
  }

  // DONT List
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11.5);
  doc.setTextColor(225, 29, 72); // rose-600
  doc.text("THINGS TO AVOID (DON'T):", 15, y);
  y += 6;

  data.dontList.forEach((item) => {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.text('✗', 15, y);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9.5);
    doc.setTextColor(51, 65, 85);
    y = addWrappedText(doc, item, 22, y, 173, 5);
    y += 1.5;
  });

  y += 6;

  if (y > 220) {
    doc.addPage();
    drawPageDecorations(doc);
    y = 30;
  }

  // WARNING SIGNS
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11.5);
  doc.setTextColor(217, 119, 6); // amber-600
  doc.text('WARNING SIGNS - CALL CLINIC IMMEDIATELY:', 15, y);
  y += 6;

  doc.setFillColor(254, 243, 199); // amber-100 bg
  doc.setDrawColor(251, 191, 36); // amber-400 border
  const linesCount = data.warningSigns.length;
  doc.rect(15, y, 180, linesCount * 6 + 6, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(120, 53, 4);

  data.warningSigns.forEach((sign, i) => {
    doc.text('⚠️', 18, y + 5.5 + i * 6);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9.5);
    doc.text(sign, 25, y + 5.5 + i * 6);
  });

  y += linesCount * 6 + 15;

  if (y > 220) {
    doc.addPage();
    drawPageDecorations(doc);
    y = 30;
  }

  // Healing timeline
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11.5);
  doc.setTextColor(15, 23, 42);
  doc.text('EXPECTED HEALING TIMELINE:', 15, y);
  y += 6;

  data.timeline.forEach((step) => {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(59, 130, 246);
    doc.text(step.title, 15, y);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9.5);
    doc.setTextColor(51, 65, 85);
    y = addWrappedText(doc, step.detail, 48, y, 147, 5);
    y += 1.5;
  });

  doc.save(`DentaCare_PostOp_${data.title.replace(/\s+/g, '_')}.pdf`);
};
