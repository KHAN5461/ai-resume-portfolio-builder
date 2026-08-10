import React from 'react';
import { Page, Text, View, Document, StyleSheet, Link } from '@react-pdf/renderer';

// Define clean, ATS-compliant typographic styles
const styles = StyleSheet.create({
  page: {
    padding: 36,
    fontSize: 10,
    fontFamily: 'Helvetica',
    color: '#222222',
    lineHeight: 1.4,
  },
  header: {
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#cccccc',
    borderBottomStyle: 'solid',
    paddingBottom: 10,
  },
  name: {
    fontSize: 22,
    fontFamily: 'Helvetica-Bold',
    color: '#111111',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  targetTitle: {
    fontSize: 12,
    fontFamily: 'Helvetica-Bold',
    color: '#4f46e5', // Indigo accent
    marginTop: 4,
    marginBottom: 6,
  },
  contactRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    fontSize: 9,
    color: '#555555',
  },
  section: {
    marginTop: 12,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 11,
    fontFamily: 'Helvetica-Bold',
    color: '#111111',
    textTransform: 'uppercase',
    borderBottomWidth: 0.75,
    borderBottomColor: '#999999',
    paddingBottom: 2,
    marginBottom: 6,
    letterSpacing: 0.5,
  },
  summaryText: {
    fontSize: 10,
    color: '#333333',
    lineHeight: 1.5,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  itemTitle: {
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
    color: '#111111',
  },
  itemSubtitle: {
    fontSize: 10,
    fontFamily: 'Helvetica-Oblique',
    color: '#444444',
  },
  dateLocation: {
    fontSize: 9,
    color: '#666666',
  },
  bulletList: {
    marginTop: 3,
    paddingLeft: 10,
  },
  bulletItem: {
    flexDirection: 'row',
    marginBottom: 2,
  },
  bulletPoint: {
    width: 10,
    fontSize: 10,
  },
  bulletText: {
    flex: 1,
    fontSize: 9.5,
    color: '#333333',
  },
  skillsCategory: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  skillsLabel: {
    width: 110,
    fontFamily: 'Helvetica-Bold',
    fontSize: 9.5,
  },
  skillsValues: {
    flex: 1,
    fontSize: 9.5,
    color: '#333333',
  },
});

export const ResumePDF = ({ resumeData }) => {
  const { personalInfo, professionalSummary, workExperience, projects, education, skills } = resumeData || {};

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        
        {/* Header / Personal Info */}
        <View style={styles.header}>
          <Text style={styles.name}>{personalInfo?.fullName || 'Your Name'}</Text>
          <Text style={styles.targetTitle}>{personalInfo?.targetTitle || 'Software Engineer'}</Text>
          <View style={styles.contactRow}>
            {personalInfo?.email && <Text>{personalInfo.email} | </Text>}
            {personalInfo?.phone && <Text>{personalInfo.phone} | </Text>}
            {personalInfo?.location && <Text>{personalInfo.location} | </Text>}
            {personalInfo?.githubUrl && <Link src={personalInfo.githubUrl}>GitHub</Link>}
            {personalInfo?.linkedinUrl && <Text> | </Text>}
            {personalInfo?.linkedinUrl && <Link src={personalInfo.linkedinUrl}>LinkedIn</Link>}
          </View>
        </View>

        {/* Professional Summary */}
        {professionalSummary && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Professional Summary</Text>
            <Text style={styles.summaryText}>{professionalSummary}</Text>
          </View>
        )}

        {/* Work Experience */}
        {workExperience && workExperience.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Professional Experience</Text>
            {workExperience.map((exp, index) => (
              <View key={index} style={{ marginBottom: 8 }}>
                <View style={styles.itemHeader}>
                  <Text style={styles.itemTitle}>{exp.role} — <Text style={styles.itemSubtitle}>{exp.company}</Text></Text>
                  <Text style={styles.dateLocation}>{exp.startDate} – {exp.current ? 'Present' : exp.endDate}</Text>
                </View>
                {exp.bullets && (
                  <View style={styles.bulletList}>
                    {exp.bullets.map((bullet, bIdx) => (
                      <View key={bIdx} style={styles.bulletItem}>
                        <Text style={styles.bulletPoint}>•</Text>
                        <Text style={styles.bulletText}>{bullet}</Text>
                      </View>
                    ))}
                  </View>
                )}
              </View>
            ))}
          </View>
        )}

        {/* Projects */}
        {projects && projects.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Key Projects</Text>
            {projects.map((proj, index) => (
              <View key={index} style={{ marginBottom: 8 }}>
                <View style={styles.itemHeader}>
                  <Text style={styles.itemTitle}>{proj.name} {proj.technologies ? `(${proj.technologies.join(', ')})` : ''}</Text>
                  <Text style={styles.dateLocation}>{proj.startDate} – {proj.endDate}</Text>
                </View>
                {proj.highlights && (
                  <View style={styles.bulletList}>
                    {proj.highlights.map((highlight, hIdx) => (
                      <View key={hIdx} style={styles.bulletItem}>
                        <Text style={styles.bulletPoint}>•</Text>
                        <Text style={styles.bulletText}>{highlight}</Text>
                      </View>
                    ))}
                  </View>
                )}
              </View>
            ))}
          </View>
        )}

        {/* Education */}
        {education && education.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Education</Text>
            {education.map((edu, index) => (
              <View key={index} style={{ marginBottom: 6 }}>
                <View style={styles.itemHeader}>
                  <Text style={styles.itemTitle}>{edu.degree}</Text>
                  <Text style={styles.dateLocation}>{edu.startDate} – {edu.endDate}</Text>
                </View>
                <Text style={styles.itemSubtitle}>{edu.institution}{edu.gpaOrHonors ? ` | ${edu.gpaOrHonors}` : ''}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Skills */}
        {skills && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Technical Skills</Text>
            {skills.languages && skills.languages.length > 0 && (
              <View style={styles.skillsCategory}>
                <Text style={styles.skillsLabel}>Languages:</Text>
                <Text style={styles.skillsValues}>{skills.languages.join(', ')}</Text>
              </View>
            )}
            {skills.frameworksAndLibraries && skills.frameworksAndLibraries.length > 0 && (
              <View style={styles.skillsCategory}>
                <Text style={styles.skillsLabel}>Frameworks/Libraries:</Text>
                <Text style={styles.skillsValues}>{skills.frameworksAndLibraries.join(', ')}</Text>
              </View>
            )}
            {skills.databasesAndTools && skills.databasesAndTools.length > 0 && (
              <View style={styles.skillsCategory}>
                <Text style={styles.skillsLabel}>Tools & Databases:</Text>
                <Text style={styles.skillsValues}>{skills.databasesAndTools.join(', ')}</Text>
              </View>
            )}
          </View>
        )}

      </Page>
    </Document>
  );
};
