// Starting Variables
const name = "Jane Doe";
const member_id = "0000000000";

const PDFDocument = require('pdfkit');
const fs = require('fs');
const moment = require('moment');
///////////////

class SuperiorHealthPlan {
  constructor(name, memberId) {
    this.doc = new PDFDocument({
      margins: {
        top: 20,
        bottom: 20,
        left: 60,
        right: 60
      }
    });
    this.name = name;
    this.memberId = memberId;

    const filename = `${name.replace(/\s/g, '')}_${moment().format('MMDDYYYY')}_${moment().format('X')}.pdf`;
    this.doc.pipe(fs.createWriteStream(`temp/${filename}`));
  }

  create() {
    this.createTemplate();
    this.addName();
    this.addSignature();
    this.addMemberID();
    this.addDate();
    this.doc.end();
  }

  createTemplate() {
    this.attachLogo();
    this.writeFax('(888) 901-8878');
    this.writeTitle();
    this.writeContent();
    this.writeNotice();
    this.writeDocNum();
  }

  addName() {
    this.doc
    .fontSize(12)
    .font('Helvetica')
    .text(this.name, 62, 190, { width: 300, align: 'center' })
  }

  addSignature() {
    this.doc
    .fontSize(12)
    .font('./fonts/Signerica_Thin.ttf')
    .text(this.name, 61, 340, { width: 150, align: 'center' });

    this.doc
    .fontSize(12)
    .font('Helvetica')
    .text(this.name, 61, 385, { width: 150 });
  }

  addMemberID() {
    this.doc
    .fontSize(12)
    .font('Helvetica')
    .text(this.memberId, 61, 425, { width: 150 });
  }

  addDate() {
    this.doc
    .fontSize(12)
    .font('Helvetica')
    .text(moment().format('MM/DD/YYYY'), 360, 340, { width: 150 });
  }

  attachLogo() {
    this.doc
    .image('./images/shp.png', 430, 20, { width: 100 });
  }

  writeFax(fax) {
    this.doc
    .fontSize(16)
    .font('Helvetica')
    .text(`Fax to: ${fax}`, 80, 60);
  }

  writeTitle() {
    this.doc
    .fontSize(14)
    .font('Helvetica-Bold')
    .text('Superior HealthPlan\nDME Preferred Provider Opt-Out Form', 150, 130, { width: 300, align: 'center' });
  }

  writeDocNum() {
    this.doc
    .fontSize(8)
    .font('Helvetica')
    .text('SHP_20174103B', 60, 750);
  }

  writeNotice() {
    const text = `
This form is valid for one year from the date of signature. Members may submit an opt-
out form annually if they would like to continue to opt-out of the DME preferred provider
program.

NOTE TO PROVIDER: Please submit this form to Superior HealthPlan with your
request for prior authorization.
`;
    this.doc
    .fontSize(12)
    .font('./fonts/OpenSans-Italic.ttf')
    .text(text, 60, 480, { lineGap: 3 });
  }

  writeContent() {
    const content = `
I, _______________________________________________(enter name), would like to
opt out of the Superior HealthPlan Durable Medical Equipment (DME) preferred
provider program. I would like __________________(Name of DME company) to
provide the DME items that are being requested on my behalf. I understand that
medical supplies ordered from non-preferred DME providers will require prior
authorization based on a review for medical necessity.`;

const signatureSpace =`
_________________________                                        ___________________
Member Signature                                                             Date

_________________________
Member Printed Name

_________________________
Superior Member ID Number`;
    this.doc
    .fontSize(12)
    .font('Helvetica')
    .text(content, 60, 170, { lineGap: 7 })
    .moveDown()
    .text(signatureSpace);
  }
}

const pdf = new SuperiorHealthPlan(name, member_id);
pdf.create();
