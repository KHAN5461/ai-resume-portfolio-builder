import React from 'react';
import { Page, Text, View, Document, StyleSheet, Font } from '@react-pdf/renderer';
import { mapResumeInfoToTemplateData } from '@/dashboard/resume/components/ResumePreview';

// We register fonts to ensure they render correctly in the PDF if needed.
// Helvetica is built-in and works out of the box.

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

export const ResumePDF = ({ resumeData, settings = { pageSize: 'A4', baseFontSize: 10, margins: 36 } }) => {
  const data = mapResumeInfoToTemplateData(resumeData);
  const { personal_info, professional_summary, experience, project, education, skills } = data;

  const baseSize = settings.baseFontSize || 10;
  // Fallback to a default color if no theme color is set
  const accentColor = resumeData?.themeColor || '#2c3e50'; 

  const dynamicStyles = StyleSheet.create({
    page: {
      padding: settings.margins || 40,
      paddingTop: (settings.margins || 40) + 10, // Add space for the absolute top bar
      fontSize: baseSize,
      fontFamily: 'Helvetica',
      color: '#333333',
      lineHeight: 1.5,
    },
    topAccentBar: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: 8,
      backgroundColor: accentColor,
    },
    headerContainer: {
      marginBottom: 24,
      borderBottomWidth: 1,
      borderBottomColor: '#e5e7eb',
      paddingBottom: 16,
    },
    name: {
      fontSize: baseSize * 2.5,
      fontFamily: 'Helvetica',
      color: accentColor,
      letterSpacing: -0.5,
      marginBottom: 2,
    },
    targetTitle: {
      fontSize: baseSize * 1.1,
      fontFamily: 'Helvetica',
      color: '#6b7280',
      textTransform: 'uppercase',
      letterSpacing: 1,
      marginBottom: 12,
    },
    contactRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 12,
      fontSize: baseSize * 0.9,
      color: '#4b5563',
    },
    contactItem: {
      marginRight: 12,
    },
    section: {
      marginBottom: 20,
    },
    sectionTitle: {
      fontSize: baseSize,
      fontFamily: 'Helvetica-Bold',
      color: accentColor,
      textTransform: 'uppercase',
      borderBottomWidth: 1,
      borderBottomColor: accentColor,
      paddingBottom: 4,
      marginBottom: 12,
      letterSpacing: 1,
    },
    summaryText: {
      fontSize: baseSize,
      color: '#374151',
      lineHeight: 1.6,
    },
    experienceBlock: {
      marginBottom: 16,
      borderLeftWidth: 3,
      borderLeftColor: accentColor,
      paddingLeft: 12,
    },
    itemHeaderRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: 4,
    },
    itemTitle: {
      fontSize: baseSize * 1.1,
      fontFamily: 'Helvetica-Bold',
      color: '#111827',
    },
    itemSubtitle: {
      fontSize: baseSize,
      fontFamily: 'Helvetica-Oblique',
      color: '#374151',
      marginTop: 2,
    },
    dateLocation: {
      fontSize: baseSize * 0.9,
      color: '#4b5563',
      textAlign: 'right',
    },
    descriptionText: {
      fontSize: baseSize,
      color: '#374151',
      lineHeight: 1.6,
      marginTop: 4,
    },
    educationBlock: {
      marginBottom: 12,
    },
    skillsContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
    },
    skillBadge: {
      backgroundColor: '#f3f4f6',
      paddingVertical: 4,
      paddingHorizontal: 8,
      borderRadius: 4,
      fontSize: baseSize * 0.9,
      color: '#374151',
      borderWidth: 1,
      borderColor: '#e5e7eb',
      marginRight: 8,
      marginBottom: 8,
    }
  });

  return (
    <Document>
      <Page size={settings.pageSize || 'A4'} style={dynamicStyles.page}>
        
        {/* Top Decorative Accent Bar */}
        <View style={dynamicStyles.topAccentBar} fixed />
        
        {/* Header / Personal Info */}
        <View style={dynamicStyles.headerContainer}>
          <Text style={dynamicStyles.name}>{personal_info?.full_name || 'Your Name'}</Text>
          {personal_info?.profession && (
             <Text style={dynamicStyles.targetTitle}>{personal_info.profession}</Text>
          )}
          
          <View style={dynamicStyles.contactRow}>
            {personal_info?.email && <Text style={dynamicStyles.contactItem}>{personal_info.email}</Text>}
            {personal_info?.phone && <Text style={dynamicStyles.contactItem}>{personal_info.phone}</Text>}
            {personal_info?.location && <Text style={dynamicStyles.contactItem}>{personal_info.location}</Text>}
            {personal_info?.linkedin && <Text style={dynamicStyles.contactItem}>{personal_info.linkedin}</Text>}
            {personal_info?.website && <Text style={dynamicStyles.contactItem}>{personal_info.website}</Text>}
          </View>
        </View>

        {/* Professional Summary */}
        {professional_summary && (
          <View style={dynamicStyles.section}>
            <Text style={dynamicStyles.sectionTitle}>Professional Summary</Text>
            <Text style={dynamicStyles.summaryText}>{stripHtml(professional_summary)}</Text>
          </View>
        )}

        {/* Work Experience */}
        {experience && experience.length > 0 && (
          <View style={dynamicStyles.section}>
            <Text style={dynamicStyles.sectionTitle}>Professional Experience</Text>
            {experience.map((exp, index) => (
              <View key={index} style={dynamicStyles.experienceBlock}>
                <View style={dynamicStyles.itemHeaderRow}>
                  <View>
                     <Text style={dynamicStyles.itemTitle}>{exp.position}</Text>
                     <Text style={dynamicStyles.itemSubtitle}>
                        {exp.company}
                        {(exp.city || exp.state) && ` | ${exp.city}${exp.city && exp.state ? ', ' : ''}${exp.state}`}
                     </Text>
                  </View>
                  <Text style={dynamicStyles.dateLocation}>{exp.start_date} – {exp.is_current ? 'Present' : exp.end_date}</Text>
                </View>
                {exp.description && (
                  <Text style={dynamicStyles.descriptionText}>{stripHtml(exp.description)}</Text>
                )}
              </View>
            ))}
          </View>
        )}

        {/* Projects */}
        {project && project.length > 0 && (
          <View style={dynamicStyles.section}>
            <Text style={dynamicStyles.sectionTitle}>Projects</Text>
            {project.map((proj, index) => (
              <View key={index} style={dynamicStyles.experienceBlock}>
                <View style={dynamicStyles.itemHeaderRow}>
                  <Text style={dynamicStyles.itemTitle}>{proj.name}</Text>
                </View>
                {proj.description && (
                  <Text style={dynamicStyles.descriptionText}>{stripHtml(proj.description)}</Text>
                )}
              </View>
            ))}
          </View>
        )}

        {/* Education */}
        {education && education.length > 0 && (
          <View style={dynamicStyles.section}>
            <Text style={dynamicStyles.sectionTitle}>Education</Text>
            {education.map((edu, index) => (
              <View key={index} style={dynamicStyles.educationBlock}>
                <View style={dynamicStyles.itemHeaderRow}>
                  <View>
                     <Text style={dynamicStyles.itemTitle}>{edu.degree} {edu.field && `in ${edu.field}`}</Text>
                     <Text style={dynamicStyles.itemSubtitle}>{edu.institution}</Text>
                     {edu.gpa && <Text style={{fontSize: baseSize * 0.9, color: '#4b5563', marginTop: 2}}>GPA: {edu.gpa}</Text>}
                  </View>
                  <Text style={dynamicStyles.dateLocation}>{edu.graduation_date}</Text>
                </View>
                {edu.description && (
                   <Text style={dynamicStyles.descriptionText}>{stripHtml(edu.description)}</Text>
                )}
              </View>
            ))}
          </View>
        )}

        {/* Skills */}
        {skills && skills.length > 0 && (
          <View style={dynamicStyles.section}>
            <Text style={dynamicStyles.sectionTitle}>Core Skills</Text>
            <View style={dynamicStyles.skillsContainer}>
               {skills.map((skill, index) => (
                   <Text key={index} style={dynamicStyles.skillBadge}>{skill}</Text>
               ))}
            </View>
          </View>
        )}

      </Page>
    </Document>
  );
};
