import jsPDF from 'jspdf';

export const generateRiskAssessmentPDF = async (assessments, clientName) => {
    const pdf = new jsPDF('p', 'mm', 'a4');

    // Set default font to ensure proper character rendering
    pdf.setFont('helvetica');

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 20;

    let yPosition = margin;

    // Helper function to add new page
    const addNewPage = () => {
        pdf.addPage();
        yPosition = margin;
    };

    // Helper function to check if we need a new page
    const checkNewPage = (requiredHeight) => {
        if (yPosition + requiredHeight > pageHeight - margin) {
            addNewPage();
        }
    };

    // Helper function to draw a colored rectangle
    const drawColoredRect = (x, y, width, height, color) => {
        pdf.setFillColor(color.r, color.g, color.b);
        pdf.rect(x, y, width, height, 'F');
    };

    // Helper function to draw a border rectangle
    const drawBorderRect = (x, y, width, height, color) => {
        pdf.setDrawColor(color.r, color.g, color.b);
        pdf.setLineWidth(0.5);
        pdf.rect(x, y, width, height);
    };

    // Helper function to add text with background
    const addTextWithBackground = (text, x, y, bgColor, textColor = { r: 255, g: 255, b: 255 }) => {
        const textWidth = pdf.getTextWidth(text);
        drawColoredRect(x - 2, y - 3, textWidth + 4, 6, bgColor);
        pdf.setTextColor(textColor.r, textColor.g, textColor.b);
        pdf.text(text, x, y);
        pdf.setTextColor(0, 0, 0); // Reset to black
    };

    // Helper function to create a table
    const createTable = (headers, data, startX, startY, colWidths) => {
        let currentY = startY;
        const rowHeight = 8;
        const headerHeight = 10;

        // Draw header
        drawColoredRect(startX, currentY, colWidths.reduce((a, b) => a + b, 0), headerHeight, { r: 52, g: 73, b: 94 });
        pdf.setTextColor(255, 255, 255);
        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'bold');

        let currentX = startX;
        headers.forEach((header, index) => {
            pdf.text(header, currentX + 2, currentY + 6);
            currentX += colWidths[index];
        });

        // Draw data rows
        pdf.setTextColor(0, 0, 0);
        pdf.setFont('helvetica', 'normal');
        currentY += headerHeight;

        data.forEach((row, rowIndex) => {
            if (rowIndex % 2 === 0) {
                drawColoredRect(startX, currentY, colWidths.reduce((a, b) => a + b, 0), rowHeight, { r: 248, g: 249, b: 250 });
            }

            currentX = startX;
            row.forEach((cell, cellIndex) => {
                pdf.text(cell, currentX + 2, currentY + 6);
                currentX += colWidths[cellIndex];
            });

            currentY += rowHeight;
        });

        // Draw borders
        drawBorderRect(startX, startY, colWidths.reduce((a, b) => a + b, 0), currentY - startY, { r: 200, g: 200, b: 200 });

        return currentY;
    };

    // Title with gradient-like effect
    drawColoredRect(0, 0, pageWidth, 40, { r: 41, g: 128, b: 185 });
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(24);
    pdf.setFont('helvetica', 'bold');
    pdf.text('RISK ASSESSMENT REPORT', pageWidth / 2, 25, { align: 'center' });

    // Subtitle
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'normal');
    pdf.text('Comprehensive Safety & Risk Management Analysis', pageWidth / 2, 35, { align: 'center' });

    yPosition = 50;

    // Client Information Box
    const displayClientName = clientName && clientName.trim() !== "" ? clientName : "Unknown Client";
    drawColoredRect(margin - 5, yPosition - 5, pageWidth - 2 * margin + 10, 25, { r: 236, g: 240, b: 241 });
    drawBorderRect(margin - 5, yPosition - 5, pageWidth - 2 * margin + 10, 25, { r: 189, g: 195, b: 199 });

    pdf.setTextColor(52, 73, 94);
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Client Information', margin, yPosition);

    pdf.setTextColor(0, 0, 0);
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'normal');
    pdf.text(`Name: ${displayClientName}`, margin, yPosition + 8);
    pdf.text(`Report Date: ${new Date().toLocaleDateString()}`, margin + 80, yPosition + 8);

    yPosition += 35;

    // Summary Statistics
    checkNewPage(60);
    pdf.setFontSize(16);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(52, 73, 94);
    pdf.text('Assessment Summary', margin, yPosition);
    yPosition += 15;

    const currentAssessments = assessments.filter(a => a.status === 'current').length;
    const dueAssessments = assessments.filter(a => a.status === 'due').length;
    const overdueAssessments = assessments.filter(a => a.status === 'overdue').length;
    const highRiskAssessments = assessments.filter(a =>
        a.overallRisk === 'high' || a.overallRisk === 'very-high'
    ).length;

    // Create summary table
    const summaryHeaders = ['Metric', 'Count', 'Status'];
    const summaryData = [
        ['Total Assessments', assessments.length.toString(), 'All'],
        ['Current', currentAssessments.toString(), 'Active'],
        ['Due for Review', dueAssessments.toString(), 'Pending'],
        ['Overdue', overdueAssessments.toString(), 'Critical'],
        ['High Risk', highRiskAssessments.toString(), 'Alert']
    ];

    yPosition = createTable(summaryHeaders, summaryData, margin, yPosition, [60, 30, 30]);
    yPosition += 15;

    // Process each assessment
    assessments.forEach((assessment, index) => {
        checkNewPage(80);

        // Assessment Header with color coding
        const riskColor = assessment.overallRisk === 'high' || assessment.overallRisk === 'very-high'
            ? { r: 231, g: 76, b: 60 }
            : assessment.overallRisk === 'medium'
                ? { r: 243, g: 156, b: 18 }
                : { r: 46, g: 204, b: 113 };

        drawColoredRect(margin - 5, yPosition - 5, pageWidth - 2 * margin + 10, 20, riskColor);
        drawBorderRect(margin - 5, yPosition - 5, pageWidth - 2 * margin + 10, 20, { r: 200, g: 200, b: 200 });

        pdf.setTextColor(255, 255, 255);
        pdf.setFontSize(14);
        pdf.setFont('helvetica', 'bold');
        const assessmentTitle = `${index + 1}. ${assessment.type.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())} Assessment`;
        pdf.text(assessmentTitle, margin, yPosition + 5);

        addTextWithBackground(
            assessment.overallRisk.toUpperCase(),
            pageWidth - margin - 30,
            yPosition + 5,
            { r: 255, g: 255, b: 255 },
            { r: 0, g: 0, b: 0 }
        );

        yPosition += 25;

        // Assessment Details Table
        const detailsHeaders = ['Field', 'Value'];
        const detailsData = [
            ['Assessment Date', assessment.assessmentDate],
            ['Assessed By', assessment.assessedBy],
            ['Review Date', assessment.reviewDate],
            ['Status', assessment.status],
            ['Version', assessment.version.toString()]
        ];

        yPosition = createTable(detailsHeaders, detailsData, margin, yPosition, [50, 100]);
        yPosition += 10;

        // Risks Section
        if (assessment.risks && assessment.risks.length > 0) {
            checkNewPage(40);
            pdf.setFontSize(14);
            pdf.setFont('helvetica', 'bold');
            pdf.setTextColor(52, 73, 94);
            pdf.text('Identified Risks', margin, yPosition);
            yPosition += 10;

            assessment.risks.forEach((risk, riskIndex) => {
                checkNewPage(50);

                // Risk header
                drawColoredRect(margin, yPosition, pageWidth - 2 * margin, 8, { r: 236, g: 240, b: 241 });
                pdf.setTextColor(52, 73, 94);
                pdf.setFontSize(11);
                pdf.setFont('helvetica', 'bold');
                pdf.text(`${riskIndex + 1}. ${risk.hazard}`, margin + 2, yPosition + 6);
                yPosition += 10;

                // Risk details
                const riskDetails = [
                    ['Who at Risk', risk.whoAtRisk?.join(', ') || 'Not specified'],
                    ['Likelihood', risk.likelihood],
                    ['Severity', risk.severity]
                ];

                yPosition = createTable(['Field', 'Value'], riskDetails, margin + 5, yPosition, [40, 110]);
                yPosition += 8;
            });
        }

        yPosition += 15;
    });

    // Footer
    const totalPages = pdf.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
        pdf.setPage(i);

        // Footer background
        drawColoredRect(0, pageHeight - 20, pageWidth, 20, { r: 52, g: 73, b: 94 });

        // Footer text
        pdf.setTextColor(255, 255, 255);
        pdf.setFontSize(8);
        pdf.setFont('helvetica', 'normal');
        pdf.text(`Generated on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}`, margin, pageHeight - 12);
        pdf.text(`Page ${i} of ${totalPages}`, pageWidth - margin, pageHeight - 12, { align: 'right' });
    }

    return pdf;
};

export const downloadRiskAssessmentPDF = async (assessments, clientName) => {
    try {
        const pdf = await generateRiskAssessmentPDF(assessments, clientName);
        const safeClientName = clientName && clientName.trim() !== ""
            ? clientName.replace(/[^a-zA-Z0-9\s]/g, '_').replace(/\s+/g, '_')
            : "Unknown_Client";
        const fileName = `Risk_Assessment_${safeClientName}_${new Date().toISOString().split('T')[0]}.pdf`;
        pdf.save(fileName);
    } catch (error) {
        console.error('Error generating PDF:', error);
        throw error;
    }
}; 