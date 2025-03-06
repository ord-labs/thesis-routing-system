'use client'

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
    marginVertical: 50,
    textAlign: "left",
  },
  signature: {
    marginTop: 40,
    textAlign: "left",
    fontWeight: "bold",
  },
});

const CertificateOfEndorsement = ({ date = '', adviserName = 'Unknown Adviser', studentNames = [] }) => {
  console.log('Rendering CertificateOfEndorsement with:', { date, adviserName, studentNames }); // Debugging information

  return (
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
            and manuscript under my supervision. Therefore, I, {adviserName}, as their
            Capstone/Thesis Adviser, hereby endorse them to proceed with their
            Final Oral Defense for the completion of their Capstone Project/Thesis
            in the degree of Bachelor of Science in Information Technology.
          </Text>
        </View>
        <View style={[styles.section, { flexDirection: "column", alignItems: "flex-start" }]}>
  <Text>Researchers:</Text>
  <View style={{ marginTop: 10 }}>
    {studentNames.length > 0 && Array.isArray(studentNames[0]) ? (
      studentNames[0].map((name, index) => (
        <Text key={index} style={{ marginBottom: 5 }}>
          {index + 1}. {name}
        </Text>
      ))
    ) : (
      <Text>No researchers found.</Text>
    )}
  </View>
</View>





        <View style={styles.section}>
          <Text>
            Their project/thesis has met the required standards and criteria set
            forth by the College of Computing and Information Sciences, and I am
            confident in the quality and academic rigor of their work.
          </Text>
        </View>

        <View style={styles.signatureSection}>
          <View style={{ marginBottom: 10 }}>
            <Text>Endorsed by:</Text>
            <Text 
              style={{ 
                borderBottomWidth: 1, 
                borderBottomColor: "black", 
                textAlign: "center", 
                marginTop: 7, 
                width: "auto", // Allow dynamic width
                minWidth: 80, // Set a minimum width to avoid very short underlines
                alignSelf: "flex-start", // Align dynamically
              }}
            >
              {adviserName}
            </Text>
          </View>


          <Text>Capstone Adviser</Text>
          <Text>{date}</Text>
        </View>

        <View style={styles.signature}>
          <Text>Approved by:</Text>
          <Text>MARLON JUHN M. TIMOGAN, MIT</Text>
          <Text>Capstone Project/Thesis Instructor</Text>
          <Text>{date}</Text>
        </View>
      </Page>
    </Document>
  );
};

export default CertificateOfEndorsement;