import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";

const leftLogo = "/smcc-logo-2.png";
const rightLogo = "/right-logo.png";

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 12,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between", // Keeps logos at each side
    marginBottom: 10,
  },
  logo: {
    width: 50, // Adjust size as needed
    height: 50,
  },
  headerTextContainer: {
    flex: 1, // Ensures it takes available space
    textAlign: "center", // Centers text
    alignItems: "center", // Ensures centering in flex layout
    justifyContent: "center",
    display: "flex",
  },
  headerText: {
    fontSize: 10,
    textAlign: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 50,
  },
  section: {
    marginVertical: 10,
    textAlign: "justify",
  },
  signatureSection: {
    marginTop: 20,
    textAlign: "left",
  },
  signature: {
    marginTop: 40,
    textAlign: "left",
    fontWeight: "bold",
  },
});

const CertificateOfEndorsement = () => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Header with Left and Right Logos */}
            <View style={styles.header}>
        <Image src={leftLogo} style={styles.logo} />
        
        <View style={styles.headerTextContainer}>
            <Text style={styles.headerText}>Saint Michael College of Caraga</Text>
            <Text style={styles.headerText}>Brgy. 4, Nasipit, Agusan del Norte, Philippines</Text>
            <Text style={styles.headerText}>Tel. Nos. +63 085 343-3251 / +63 085 283-3113</Text>
            <Text style={styles.headerText}>Fax No. +63 085 808-0892</Text>
            <Text style={styles.headerText}>www.smccnasipit.edu.ph</Text>
        </View>

        <Image src={rightLogo} style={styles.logo} />
        </View>


      <Text style={styles.title}>CERTIFICATE OF ENDORSEMENT</Text>

      <View style={styles.section}>
        <Text>
          This is to certify that the following researchers have successfully
          completed a thorough checking and assessment of their software system
          and manuscript under my supervision. Therefore, I, ___________ as their
          Capstone/Thesis Adviser, hereby endorse them to proceed with their
          Final Oral Defense for the completion of their Capstone Project/Thesis
          in the degree of Bachelor of Science in Information Technology.
        </Text>
      </View>

      <View style={styles.section}>
        <Text>Researchers:</Text>
        <Text>1. [Student Name 1]</Text>
        <Text>2. [Student Name 2]</Text>
        <Text>3. [Student Name 3]</Text>
      </View>

      <View style={styles.section}>
        <Text>
          Their project/thesis has met the required standards and criteria set
          forth by the College of Computing and Information Sciences, and I am
          confident in the quality and academic rigor of their work.
        </Text>
      </View>

      <View style={styles.signatureSection}>
        <Text>Endorsed by:</Text>
        <Text>____________________________</Text>
        <Text>Capstone Adviser</Text>
        <Text>18/10/2024</Text>
      </View>

      <View style={styles.signature}>
        <Text>Approved by:</Text>
        <Text>MARLON JUHN M. TIMOGAN, MIT</Text>
        <Text>Capstone Project/Thesis Instructor</Text>
        <Text>18/10/2024</Text>
      </View>
    </Page>
  </Document>
);

export default CertificateOfEndorsement;