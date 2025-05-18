import AssessmentFramework from "../models/assessmentFrameworkModel.js";
import PDFDocument from "pdfkit";

export const downloadReport = async (req, res) => {
  try {
    const { id } = req.params;
    const user = req.userId;

    const rubric = await AssessmentFramework.findOne({ _id: id, user });

    if (!rubric) {
      return res.status(404).json({ message: "Rubric not found" });
    }

    // Set response headers
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=${rubric.title.replace(/\s+/g, "_")}_rubric.pdf`
    );

    // Create PDF document - using landscape to fit more columns
    const doc = new PDFDocument({
      margin: 30,
      size: "A4",
      layout: "landscape",
    });

    // Create an array to store PDF chunks
    const chunks = [];

    // Listen for data events
    doc.on("data", (chunk) => {
      chunks.push(chunk);
    });

    // Listen for end event
    doc.on("end", () => {
      // Concatenate chunks into a single buffer
      const pdfBuffer = Buffer.concat(chunks);
      // Send the buffer as response
      res.send(pdfBuffer);
    });

    // Add title with smaller font to save space
    doc.fontSize(18).text(rubric.title, { align: "center" });
    doc.moveDown(0.5);

    doc
      .fontSize(16)
      .text(`Possible Points: ${rubric.total}`, { align: "left" });
    doc.moveDown(0.5);

    // Table configuration
    const tableTop = doc.y;
    const tableLeft = 30;
    const cellPadding = 3;

    // Calculate column widths based on scoring scale length
    const criteriaColWidth = 120;
    const scoringScaleLength = rubric.scoringScale?.length || 0;
    const availableWidth = doc.page.width - 60; // Account for margins
    const scoreColWidth =
      scoringScaleLength > 0
        ? (availableWidth - criteriaColWidth) / scoringScaleLength
        : 100;

    // Helper function to draw a table cell with compact styling
    function drawTableCell(text, x, y, width, height, options = {}) {
      // Draw cell border
      doc.rect(x, y, width, height).stroke();

      // Background color for header cells
      if (options.isHeader) {
        doc.fillColor("#f0f0f0").rect(x, y, width, height).fill();
        doc.fillColor("#000000"); // Reset to black for text
      }

      // Draw cell content with small font to fit more content
      const textOptions = {
        width: width - cellPadding * 2,
        align: options.align || "left",
        lineBreak: true,
      };

      // Use smaller font sizes to fit more content on one page
      doc.font(options.bold ? "Helvetica-Bold" : "Helvetica");
      doc.fontSize(options.fontSize || 8); // Smaller font size for content
      doc.text(text || "", x + cellPadding, y + cellPadding, textOptions);
    }

    // Function to draw the table header
    function drawTableHeader(currentY) {
      // Draw first row with criteria label
      drawTableCell(
        "Criteria",
        tableLeft,
        currentY,
        criteriaColWidth,
        headerHeight,
        { bold: true, align: "center", isHeader: true, fontSize: 9 }
      );

      // Draw scoring scale headers with scores and descriptions combined
      if (scoringScaleLength > 0) {
        rubric.scoringScale.forEach((scale, index) => {
          const x = tableLeft + criteriaColWidth + index * scoreColWidth;
          const headerText = `Score: ${scale.score}\n${scale.description}`;
          drawTableCell(headerText, x, currentY, scoreColWidth, headerHeight, {
            bold: true,
            align: "center",
            isHeader: true,
            fontSize: 9,
          });
        });
      }

      return currentY + headerHeight;
    }

    // Initial header height
    const headerHeight = 30; // Combined header height

    // Draw the header once at the beginning
    let currentY = drawTableHeader(tableTop);

    // Calculate row height based on available space and number of criteria
    const availableHeight = doc.page.height - currentY - 40; // Leave room for footer
    const criteriaCount = rubric.criteriaArray?.length || 1;
    // Use a minimum height but adjust if there are many criteria
    const rowHeight = Math.max(
      Math.min(40, availableHeight / criteriaCount),
      20
    );

    // Track if we need to add a new page
    let needsNewPage = false;

    // Draw each criteria row
    if (rubric.criteriaArray && rubric.criteriaArray.length > 0) {
      rubric.criteriaArray.forEach((cri, criterionIndex) => {
        // Check if we need a new page before drawing this row
        if (currentY + rowHeight > doc.page.height - 40) {
          doc.addPage();
          currentY = 30; // Reset Y position for new page
          // Don't draw header on new pages (remove this line if you want headers on each page)
          // currentY = drawTableHeader(currentY);
          needsNewPage = false;
        }

        // Draw criteria name
        drawTableCell(
          cri.criterion,
          tableLeft,
          currentY,
          criteriaColWidth,
          rowHeight,
          { bold: true, fontSize: 8 }
        );

        // Draw descriptor cells for each scoring scale level

        cri.descriptor.forEach((desc, descIndex) => {
          // Only draw if we have a corresponding scoring scale
          if (descIndex < scoringScaleLength) {
            const x = tableLeft + criteriaColWidth + descIndex * scoreColWidth;
            drawTableCell(desc, x, currentY, scoreColWidth, rowHeight, {
              fontSize: 8,
            });
          }
        });

        currentY += rowHeight;
      });
    } else {
      // No criteria available
      drawTableCell(
        "No criteria available",
        tableLeft,
        currentY,
        availableWidth,
        30,
        { align: "center", fontSize: 8 }
      );
      currentY += 30;
    }
    console.log("Oh shi im getting hit");

    console.log(rubric.title);

    // Finalize the PDF
    doc.end();
  } catch (error) {
    console.error("Error generating PDF:", error);
    res.status(500).json({ message: "Error generating PDF report" });
  }
};
