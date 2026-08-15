import React from 'react';
import { Page, Text, View, Document, StyleSheet, Font, Svg, Path, Image } from '@react-pdf/renderer';
import { mapResumeInfoToTemplateData } from '@/lib/templateDataMapper';

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

const PhoneIcon = ({ color, size = 10 }) => (
  <Svg viewBox="0 0 24 24" width={size} height={size} fill="none">
    <Path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const MailIcon = ({ color, size = 10 }) => (
  <Svg viewBox="0 0 24 24" width={size} height={size} fill="none">
    <Path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M22 6l-10 7L2 6" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const MapPinIcon = ({ color, size = 10 }) => (
  <Svg viewBox="0 0 24 24" width={size} height={size} fill="none">
    <Path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M12 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const LinkedinIcon = ({ color, size = 10 }) => (
  <Svg viewBox="0 0 24 24" width={size} height={size} fill="none">
    <Path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M2 9h4v12H2z" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M4 6a2 2 0 1 0 0-4 2 2 0 0 0 0 4z" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const GlobeIcon = ({ color, size = 10 }) => (
  <Svg viewBox="0 0 24 24" width={size} height={size} fill="none">
    <Path d="M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M2 12h20" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

export const ResumePDF = ({ resumeData, settings = { pageSize: 'A4', baseFontSize: 10, margins: 36 } }) => {
  const data = mapResumeInfoToTemplateData(resumeData);
  const { personal_info, professional_summary, experience, project, education, skills } = data;

  const baseSize = settings.baseFontSize || 10;
  // Fallback to a default color if no theme color is set
  const accentColor = resumeData?.themeColor || '#2c3e50'; 
  const templateType = resumeData?.themeTemplate || 'Classic';

  const fontMap = {
    'Inter': 'Helvetica',
    'Merriweather': 'Times-Roman',
    'Roboto Mono': 'Courier',
    'Outfit': 'Helvetica'
  };
  const pdfFont = fontMap[resumeData?.themeFont] || 'Helvetica';
  const pdfFontBold = pdfFont === 'Times-Roman' ? 'Times-Bold' : pdfFont === 'Courier' ? 'Courier-Bold' : 'Helvetica-Bold';
  const pdfFontOblique = pdfFont === 'Times-Roman' ? 'Times-Italic' : pdfFont === 'Courier' ? 'Courier-Oblique' : 'Helvetica-Oblique';

  const dynamicStyles = StyleSheet.create({
    page: {
      padding: settings.margins || 40,
      paddingTop: (settings.margins || 40) + (templateType === 'Classic' ? 10 : 0),
      fontSize: baseSize,
      fontFamily: pdfFont,
      color: '#333333',
      lineHeight: 1.5,
    },
    modernPage: {
      padding: 0,
      fontSize: baseSize,
      fontFamily: pdfFont,
      color: '#333333',
      lineHeight: 1.5,
    },
    // Classic Styles
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
      fontFamily: pdfFont,
      color: accentColor,
      letterSpacing: -0.5,
      marginBottom: 2,
    },
    targetTitle: {
      fontSize: baseSize * 1.1,
      fontFamily: pdfFont,
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
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
      marginRight: 12,
    },
    contactText: {
      marginLeft: 4,
    },
    section: {
      marginBottom: 20,
    },
    sectionTitle: {
      fontSize: baseSize,
      fontFamily: pdfFontBold,
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
      fontFamily: pdfFontBold,
      color: '#111827',
    },
    itemSubtitle: {
      fontSize: baseSize,
      fontFamily: pdfFontOblique,
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
    },
    
    // Modern Styles
    modernHeader: {
      backgroundColor: accentColor,
      padding: settings.margins || 40,
      color: '#ffffff',
      marginBottom: 20,
    },
    modernName: {
      fontSize: baseSize * 2.8,
      fontFamily: pdfFont,
      color: '#ffffff',
      marginBottom: 6,
    },
    modernTargetTitle: {
      fontSize: baseSize * 1.2,
      fontFamily: pdfFontBold,
      color: '#ffffff',
      opacity: 0.9,
      marginBottom: 12,
    },
    modernContactRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 12,
      fontSize: baseSize * 0.9,
      color: '#ffffff',
    },
    modernContactItem: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
      marginRight: 12,
    },
    modernSectionTitle: {
      fontSize: baseSize * 1.4,
      fontFamily: pdfFont,
      color: '#111827',
      borderBottomWidth: 1,
      borderBottomColor: '#e5e7eb',
      paddingBottom: 6,
      marginBottom: 12,
    },
    modernExperienceBlock: {
      marginBottom: 16,
      borderLeftWidth: 1,
      borderLeftColor: '#e5e7eb',
      paddingLeft: 16,
    },
    modernItemTitle: {
      fontSize: baseSize * 1.2,
      fontFamily: pdfFont,
      color: '#111827',
    },
    modernItemSubtitle: {
      fontSize: baseSize,
      fontFamily: pdfFontBold,
      color: accentColor,
      marginTop: 2,
    },
    modernDateLocation: {
      fontSize: baseSize * 0.9,
      backgroundColor: '#f3f4f6',
      paddingVertical: 2,
      paddingHorizontal: 6,
      borderRadius: 4,
      color: '#4b5563',
    },
    modernSkillBadge: {
      backgroundColor: accentColor,
      paddingVertical: 4,
      paddingHorizontal: 10,
      borderRadius: 12,
      fontSize: baseSize * 0.9,
      color: '#ffffff',
      marginRight: 6,
      marginBottom: 6,
    },
    
    // Minimal Styles
    minimalName: {
      fontSize: baseSize * 3,
      fontFamily: pdfFont,
      color: '#111827',
      letterSpacing: 2,
      marginBottom: 8,
    },
    minimalTargetTitle: {
      fontSize: baseSize * 1.1,
      fontFamily: pdfFont,
      color: '#6b7280',
      textTransform: 'uppercase',
      letterSpacing: 1.5,
      marginBottom: 16,
    },
    minimalContactRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 16,
      fontSize: baseSize * 0.9,
      color: '#4b5563',
    },
    minimalSectionTitle: {
      fontSize: baseSize * 0.85,
      fontFamily: 'Helvetica-Bold',
      color: accentColor,
      textTransform: 'uppercase',
      letterSpacing: 2,
      marginBottom: 16,
    },
    minimalItemTitle: {
      fontSize: baseSize * 1.1,
      fontFamily: 'Helvetica',
      color: '#111827',
    },
    minimalDate: {
      fontSize: baseSize * 0.9,
      color: '#6b7280',
    },
    
    // Minimal Image Styles
    minimalImageGrid: {
      flexDirection: 'row',
      marginBottom: 0,
    },
    minimalImageLeftCol: {
      width: '33%',
      paddingRight: 20,
      borderRightWidth: 1,
      borderRightColor: '#e5e7eb',
    },
    minimalImageRightCol: {
      width: '67%',
      paddingLeft: 20,
    },
    minimalImageHeader: {
      marginBottom: 24,
    },
    minimalImageProfile: {
      width: 100,
      height: 100,
      borderRadius: 50,
      marginBottom: 20,
      objectFit: 'cover',
    },
    minimalImageSidebarSection: {
      marginBottom: 20,
    },
    minimalImageSkillPill: {
      backgroundColor: '#f3f4f6',
      paddingVertical: 4,
      paddingHorizontal: 8,
      borderRadius: 12,
      fontSize: baseSize * 0.85,
      color: '#374151',
      marginBottom: 6,
    },
  });

  try {
    if (templateType === 'Modern') {
    return (
      <Document>
        <Page size={settings.pageSize || 'A4'} style={dynamicStyles.modernPage}>
          <View style={dynamicStyles.modernHeader}>
            <Text style={dynamicStyles.modernName}>{personal_info?.full_name || 'Your Name'}</Text>
            {personal_info?.profession && (
               <Text style={dynamicStyles.modernTargetTitle}>{personal_info.profession}</Text>
            )}
            <View style={dynamicStyles.modernContactRow}>
              {personal_info?.email && (
                <View style={dynamicStyles.modernContactItem}>
                  <MailIcon color="#ffffff" size={12} />
                  <Text style={dynamicStyles.contactText}>{personal_info.email}</Text>
                </View>
              )}
              {personal_info?.phone && (
                <View style={dynamicStyles.modernContactItem}>
                  <PhoneIcon color="#ffffff" size={12} />
                  <Text style={dynamicStyles.contactText}>{personal_info.phone}</Text>
                </View>
              )}
              {personal_info?.location && (
                <View style={dynamicStyles.modernContactItem}>
                  <MapPinIcon color="#ffffff" size={12} />
                  <Text style={dynamicStyles.contactText}>{personal_info.location}</Text>
                </View>
              )}
              {personal_info?.linkedin && (
                <View style={dynamicStyles.modernContactItem}>
                  <LinkedinIcon color="#ffffff" size={12} />
                  <Text style={dynamicStyles.contactText}>{personal_info.linkedin}</Text>
                </View>
              )}
              {personal_info?.website && (
                <View style={dynamicStyles.modernContactItem}>
                  <GlobeIcon color="#ffffff" size={12} />
                  <Text style={dynamicStyles.contactText}>{personal_info.website}</Text>
                </View>
              )}
            </View>
          </View>

          <View style={{ padding: settings.margins || 40, paddingTop: 0 }}>
            {professional_summary && (
              <View style={dynamicStyles.section}>
                <Text style={dynamicStyles.modernSectionTitle}>Professional Summary</Text>
                <Text style={dynamicStyles.summaryText}>{stripHtml(professional_summary)}</Text>
              </View>
            )}

            {experience && experience.length > 0 && (
              <View style={dynamicStyles.section}>
                <Text style={dynamicStyles.modernSectionTitle}>Experience</Text>
                {experience.map((exp, index) => (
                  <View key={index} style={dynamicStyles.modernExperienceBlock}>
                    <View style={dynamicStyles.itemHeaderRow}>
                      <View>
                         <Text style={dynamicStyles.modernItemTitle}>{exp.position}</Text>
                         <Text style={dynamicStyles.modernItemSubtitle}>{exp.company}</Text>
                      </View>
                      <Text style={dynamicStyles.modernDateLocation}>{exp.start_date} – {exp.is_current ? 'Present' : exp.end_date}</Text>
                    </View>
                    {exp.description && (
                      <Text style={dynamicStyles.descriptionText}>{stripHtml(exp.description)}</Text>
                    )}
                  </View>
                ))}
              </View>
            )}

            {project && project.length > 0 && (
              <View style={dynamicStyles.section}>
                <Text style={dynamicStyles.modernSectionTitle}>Projects</Text>
                {project.map((proj, index) => (
                  <View key={index} style={[dynamicStyles.modernExperienceBlock, { borderLeftColor: accentColor }]}>
                    <View style={dynamicStyles.itemHeaderRow}>
                      <Text style={dynamicStyles.modernItemTitle}>{proj.name}</Text>
                    </View>
                    {proj.description && (
                      <Text style={dynamicStyles.descriptionText}>{stripHtml(proj.description)}</Text>
                    )}
                  </View>
                ))}
              </View>
            )}

            <View style={{ flexDirection: 'row', gap: 32 }}>
              {education && education.length > 0 && (
                <View style={[dynamicStyles.section, { flex: 1 }]}>
                  <Text style={dynamicStyles.modernSectionTitle}>Education</Text>
                  {education.map((edu, index) => (
                    <View key={index} style={dynamicStyles.educationBlock}>
                      <Text style={[dynamicStyles.modernItemTitle, { fontSize: baseSize }]}>{edu.degree} {edu.field && `in ${edu.field}`}</Text>
                      <Text style={dynamicStyles.modernItemSubtitle}>{edu.institution}</Text>
                      <View style={[dynamicStyles.itemHeaderRow, { marginTop: 4 }]}>
                         <Text style={{ fontSize: baseSize * 0.9, color: '#6b7280' }}>{edu.graduation_date}</Text>
                         {edu.gpa && <Text style={{ fontSize: baseSize * 0.9, color: '#6b7280' }}>GPA: {edu.gpa}</Text>}
                      </View>
                    </View>
                  ))}
                </View>
              )}

              {skills && skills.length > 0 && (
                <View style={[dynamicStyles.section, { flex: 1 }]}>
                  <Text style={dynamicStyles.modernSectionTitle}>Skills</Text>
                  <View style={dynamicStyles.skillsContainer}>
                     {skills.map((skill, index) => (
                         <Text key={index} style={dynamicStyles.modernSkillBadge}>{skill}</Text>
                     ))}
                  </View>
                </View>
              )}
            </View>
          </View>
        </Page>
      </Document>
    );
  }

  if (templateType === 'Minimal') {
    return (
      <Document>
        <Page size={settings.pageSize || 'A4'} style={dynamicStyles.page}>
          <View style={{ marginBottom: 40 }}>
            <Text style={dynamicStyles.minimalName}>{personal_info?.full_name || 'Your Name'}</Text>
            {personal_info?.profession && (
               <Text style={dynamicStyles.minimalTargetTitle}>{personal_info.profession}</Text>
            )}
            <View style={dynamicStyles.minimalContactRow}>
              {personal_info?.email && (
                <View style={dynamicStyles.contactItem}>
                  <MailIcon color={accentColor} size={12} />
                  <Text style={dynamicStyles.contactText}>{personal_info.email}</Text>
                </View>
              )}
              {personal_info?.phone && (
                <View style={dynamicStyles.contactItem}>
                  <PhoneIcon color={accentColor} size={12} />
                  <Text style={dynamicStyles.contactText}>{personal_info.phone}</Text>
                </View>
              )}
              {personal_info?.location && (
                <View style={dynamicStyles.contactItem}>
                  <MapPinIcon color={accentColor} size={12} />
                  <Text style={dynamicStyles.contactText}>{personal_info.location}</Text>
                </View>
              )}
              {personal_info?.linkedin && (
                <View style={dynamicStyles.contactItem}>
                  <LinkedinIcon color={accentColor} size={12} />
                  <Text style={dynamicStyles.contactText}>{personal_info.linkedin}</Text>
                </View>
              )}
              {personal_info?.website && (
                <View style={dynamicStyles.contactItem}>
                  <GlobeIcon color={accentColor} size={12} />
                  <Text style={dynamicStyles.contactText}>{personal_info.website}</Text>
                </View>
              )}
            </View>
          </View>

          {professional_summary && (
            <View style={{ marginBottom: 32 }}>
              <Text style={dynamicStyles.summaryText}>{stripHtml(professional_summary)}</Text>
            </View>
          )}

          {experience && experience.length > 0 && (
            <View style={dynamicStyles.section}>
              <Text style={dynamicStyles.minimalSectionTitle}>Experience</Text>
              {experience.map((exp, index) => (
                <View key={index} style={{ marginBottom: 20 }}>
                  <View style={dynamicStyles.itemHeaderRow}>
                    <Text style={dynamicStyles.minimalItemTitle}>{exp.position}</Text>
                    <Text style={dynamicStyles.minimalDate}>{exp.start_date} – {exp.is_current ? 'Present' : exp.end_date}</Text>
                  </View>
                  <Text style={{ fontSize: baseSize, color: '#4b5563', marginBottom: 4 }}>{exp.company}</Text>
                  {exp.description && (
                    <Text style={dynamicStyles.descriptionText}>{stripHtml(exp.description)}</Text>
                  )}
                </View>
              ))}
            </View>
          )}

          {project && project.length > 0 && (
            <View style={dynamicStyles.section}>
              <Text style={dynamicStyles.minimalSectionTitle}>Projects</Text>
              {project.map((proj, index) => (
                <View key={index} style={{ marginBottom: 16 }}>
                  <Text style={dynamicStyles.minimalItemTitle}>{proj.name}</Text>
                  {proj.description && (
                    <Text style={dynamicStyles.descriptionText}>{stripHtml(proj.description)}</Text>
                  )}
                </View>
              ))}
            </View>
          )}

          {education && education.length > 0 && (
            <View style={dynamicStyles.section}>
              <Text style={dynamicStyles.minimalSectionTitle}>Education</Text>
              {education.map((edu, index) => (
                <View key={index} style={dynamicStyles.educationBlock}>
                  <View style={dynamicStyles.itemHeaderRow}>
                    <View>
                       <Text style={[dynamicStyles.minimalItemTitle, { fontSize: baseSize }]}>{edu.degree} {edu.field && `in ${edu.field}`}</Text>
                       <Text style={{ fontSize: baseSize, color: '#4b5563' }}>{edu.institution}</Text>
                       {edu.gpa && <Text style={{fontSize: baseSize * 0.9, color: '#6b7280', marginTop: 2}}>GPA: {edu.gpa}</Text>}
                    </View>
                    <Text style={dynamicStyles.minimalDate}>{edu.graduation_date}</Text>
                  </View>
                </View>
              ))}
            </View>
          )}

          {skills && skills.length > 0 && (
            <View style={dynamicStyles.section}>
              <Text style={dynamicStyles.minimalSectionTitle}>Skills</Text>
              <Text style={{ fontSize: baseSize, color: '#374151', lineHeight: 1.6 }}>
                 {skills.join(" • ")}
              </Text>
            </View>
          )}
        </Page>
      </Document>
    );
  }

  if (templateType === 'MinimalImage') {
    // Attempt to extract an image source (support for base64 or absolute URLs)
    // If it's a File object (which shouldn't be the case in Redux data), react-pdf doesn't support it directly without a blob URL (which is async).
    // Assuming personal_info.image is a base64 string or URL.
    const imgSrc = typeof personal_info?.image === 'string' ? personal_info.image : null;

    return (
      <Document>
        <Page size={settings.pageSize || 'A4'} style={[dynamicStyles.page, { flexDirection: 'row', paddingTop: 40 }]}>
          
          {/* Left Sidebar */}
          <View style={dynamicStyles.minimalImageLeftCol}>
            {imgSrc && (
              <Image src={imgSrc} style={dynamicStyles.minimalImageProfile} />
            )}
            
            <View style={dynamicStyles.minimalImageSidebarSection}>
              <Text style={dynamicStyles.minimalSectionTitle}>Contact</Text>
              <View style={{ gap: 8 }}>
                {personal_info?.phone && (
                  <View style={dynamicStyles.contactItem}>
                    <PhoneIcon color={accentColor} size={12} />
                    <Text style={dynamicStyles.contactText}>{personal_info.phone}</Text>
                  </View>
                )}
                {personal_info?.email && (
                  <View style={dynamicStyles.contactItem}>
                    <MailIcon color={accentColor} size={12} />
                    <Text style={dynamicStyles.contactText}>{personal_info.email}</Text>
                  </View>
                )}
                {personal_info?.location && (
                  <View style={dynamicStyles.contactItem}>
                    <MapPinIcon color={accentColor} size={12} />
                    <Text style={dynamicStyles.contactText}>{personal_info.location}</Text>
                  </View>
                )}
                {personal_info?.linkedin && (
                  <View style={dynamicStyles.contactItem}>
                    <LinkedinIcon color={accentColor} size={12} />
                    <Text style={dynamicStyles.contactText}>{personal_info.linkedin}</Text>
                  </View>
                )}
              </View>
            </View>

            {education && education.length > 0 && (
              <View style={dynamicStyles.minimalImageSidebarSection}>
                <Text style={dynamicStyles.minimalSectionTitle}>Education</Text>
                {education.map((edu, index) => (
                  <View key={index} style={{ marginBottom: 12 }}>
                    <Text style={{ fontSize: baseSize, fontFamily: pdfFontBold, color: '#111827' }}>{edu.degree}</Text>
                    <Text style={{ fontSize: baseSize * 0.9, color: '#4b5563', marginTop: 2 }}>{edu.institution}</Text>
                    <Text style={{ fontSize: baseSize * 0.9, color: '#6b7280', marginTop: 2 }}>{edu.graduation_date}</Text>
                  </View>
                ))}
              </View>
            )}

            {skills && skills.length > 0 && (
              <View style={dynamicStyles.minimalImageSidebarSection}>
                <Text style={dynamicStyles.minimalSectionTitle}>Skills</Text>
                <View style={{ flexWrap: 'wrap' }}>
                  {skills.map((skill, index) => (
                    <Text key={index} style={dynamicStyles.minimalImageSkillPill}>{skill}</Text>
                  ))}
                </View>
              </View>
            )}
          </View>

          {/* Right Main Content */}
          <View style={dynamicStyles.minimalImageRightCol}>
            <View style={dynamicStyles.minimalImageHeader}>
              <Text style={dynamicStyles.minimalName}>{personal_info?.full_name || 'Your Name'}</Text>
              {personal_info?.profession && (
                 <Text style={[dynamicStyles.minimalTargetTitle, { color: accentColor }]}>{personal_info.profession}</Text>
              )}
            </View>

            {professional_summary && (
              <View style={dynamicStyles.section}>
                <Text style={dynamicStyles.minimalSectionTitle}>Summary</Text>
                <Text style={dynamicStyles.summaryText}>{stripHtml(professional_summary)}</Text>
              </View>
            )}

            {experience && experience.length > 0 && (
              <View style={dynamicStyles.section}>
                <Text style={dynamicStyles.minimalSectionTitle}>Experience</Text>
                {experience.map((exp, index) => (
                  <View key={index} style={{ marginBottom: 20 }}>
                    <View style={dynamicStyles.itemHeaderRow}>
                      <Text style={dynamicStyles.minimalItemTitle}>{exp.position}</Text>
                      <Text style={dynamicStyles.minimalDate}>{exp.start_date} – {exp.is_current ? 'Present' : exp.end_date}</Text>
                    </View>
                    <Text style={{ fontSize: baseSize, color: '#4b5563', marginBottom: 4 }}>{exp.company}</Text>
                    {exp.description && (
                      <Text style={dynamicStyles.descriptionText}>{stripHtml(exp.description)}</Text>
                    )}
                  </View>
                ))}
              </View>
            )}

            {project && project.length > 0 && (
              <View style={dynamicStyles.section}>
                <Text style={dynamicStyles.minimalSectionTitle}>Projects</Text>
                {project.map((proj, index) => (
                  <View key={index} style={{ marginBottom: 16 }}>
                    <Text style={dynamicStyles.minimalItemTitle}>{proj.name}</Text>
                    {proj.description && (
                      <Text style={dynamicStyles.descriptionText}>{stripHtml(proj.description)}</Text>
                    )}
                  </View>
                ))}
              </View>
            )}
          </View>
          
        </Page>
      </Document>
    );
  }

  // Classic Template (Default)
  return (
    <Document>
      <Page size={settings.pageSize || 'A4'} style={dynamicStyles.page}>
        <View style={dynamicStyles.topAccentBar} fixed />
        
        <View style={dynamicStyles.headerContainer}>
          <Text style={dynamicStyles.name}>{personal_info?.full_name || 'Your Name'}</Text>
          {personal_info?.profession && (
             <Text style={dynamicStyles.targetTitle}>{personal_info.profession}</Text>
          )}
          
          <View style={dynamicStyles.contactRow}>
            {personal_info?.email && (
              <View style={dynamicStyles.contactItem}>
                <MailIcon color={accentColor} size={12} />
                <Text style={dynamicStyles.contactText}>{personal_info.email}</Text>
              </View>
            )}
            {personal_info?.phone && (
              <View style={dynamicStyles.contactItem}>
                <PhoneIcon color={accentColor} size={12} />
                <Text style={dynamicStyles.contactText}>{personal_info.phone}</Text>
              </View>
            )}
            {personal_info?.location && (
              <View style={dynamicStyles.contactItem}>
                <MapPinIcon color={accentColor} size={12} />
                <Text style={dynamicStyles.contactText}>{personal_info.location}</Text>
              </View>
            )}
            {personal_info?.linkedin && (
              <View style={dynamicStyles.contactItem}>
                <LinkedinIcon color={accentColor} size={12} />
                <Text style={dynamicStyles.contactText}>{personal_info.linkedin}</Text>
              </View>
            )}
            {personal_info?.website && (
              <View style={dynamicStyles.contactItem}>
                <GlobeIcon color={accentColor} size={12} />
                <Text style={dynamicStyles.contactText}>{personal_info.website}</Text>
              </View>
            )}
          </View>
        </View>

        {professional_summary && (
          <View style={dynamicStyles.section}>
            <Text style={dynamicStyles.sectionTitle}>Professional Summary</Text>
            <Text style={dynamicStyles.summaryText}>{stripHtml(professional_summary)}</Text>
          </View>
        )}

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
  } catch (error) {
    return (
      <Document>
        <Page size="A4" style={{ padding: 40 }}>
          <Text>Error generating PDF. Please check your resume data and try again.</Text>
          <Text style={{ fontSize: 10, color: 'gray', marginTop: 10 }}>{error.message}</Text>
        </Page>
      </Document>
    );
  }
};
