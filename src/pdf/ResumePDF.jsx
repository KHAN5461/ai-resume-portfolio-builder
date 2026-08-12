import React from 'react';
import { Page, Text, View, Document, StyleSheet, Link } from '@react-pdf/renderer';
import { mapResumeInfoToTemplateData } from '@/dashboard/resume/components/ResumePreview';

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
    color: '#4f46e5',
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

const stripHtml = (html) => {
  if (!html) return '';
  return html
    .replace(/<li>/gi, '• ')
    .replace(/<\/li>/gi, '\n')
    .replace(/<\/p>/gi, '\n')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .trim();
};

export const ResumePDF = ({ resumeData }) => {
  const data = mapResumeInfoToTemplateData(resumeData);
  const { personal_info, professional_summary, experience, project, education, skills } = data;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        
        {/* Header / Personal Info */}
        <View style={styles.header}>
          <Text style={styles.name}>{personal_info?.full_name || 'Your Name'}</Text>
          <Text style={styles.targetTitle}>{personal_info?.profession || 'Professional Title'}</Text>
          <View style={styles.contactRow}>
            {personal_info?.email && <Text>{personal_info.email}</Text>}
            {personal_info?.phone && <Text> | {personal_info.phone}</Text>}
            {personal_info?.location && <Text> | {personal_info.location}</Text>}
            {personal_info?.linkedin && <Text> | {personal_info.linkedin}</Text>}
          </View>
        </View>

        {/* Professional Summary */}
        {professional_summary && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Professional Summary</Text>
            <Text style={styles.summaryText}>{stripHtml(professional_summary)}</Text>
          </View>
        )}

        {/* Work Experience */}
        {experience && experience.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Professional Experience</Text>
            {experience.map((exp, index) => (
              <View key={index} style={{ marginBottom: 8 }}>
                <View style={styles.itemHeader}>
                  <Text style={styles.itemTitle}>{exp.position} — <Text style={styles.itemSubtitle}>{exp.company}</Text></Text>
                  <Text style={styles.dateLocation}>{exp.start_date} – {exp.is_current ? 'Present' : exp.end_date}</Text>
                </View>
                {exp.description && (
                  <View style={styles.bulletList}>
                    <Text style={styles.summaryText}>{stripHtml(exp.description)}</Text>
                  </View>
                )}
              </View>
            ))}
          </View>
        )}

        {/* Projects */}
        {project && project.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Key Projects</Text>
            {project.map((proj, index) => (
              <View key={index} style={{ marginBottom: 8 }}>
                <View style={styles.itemHeader}>
                  <Text style={styles.itemTitle}>{proj.name}</Text>
                </View>
                {proj.description && (
                  <View style={styles.bulletList}>
                    <Text style={styles.summaryText}>{stripHtml(proj.description)}</Text>
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
                  <Text style={styles.itemTitle}>{edu.degree} {edu.field && `in ${edu.field}`}</Text>
                  <Text style={styles.dateLocation}>{edu.graduation_date}</Text>
                </View>
                <Text style={styles.itemSubtitle}>{edu.institution}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Skills */}
        {skills && skills.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Technical Skills</Text>
            <View style={styles.skillsCategory}>
               <Text style={styles.skillsValues}>{skills.join(' • ')}</Text>
            </View>
          </View>
        )}

      </Page>
    </Document>
  );
};
