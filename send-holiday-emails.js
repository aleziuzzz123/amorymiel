// Script to send holiday emails for Amor y Miel
// Run this to send test emails for all special days

import { holidayTemplates } from './holiday-email-templates.js';

const testEmail = 'babilionllc@gmail.com';
const testUserName = 'Test User';

// Function to send a holiday email
async function sendHolidayEmail(holidayKey, template) {
  try {
    console.log(`📧 Sending ${template.name} email...`);
    
    const response = await fetch('https://amorymiel.com/.netlify/functions/send-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        emailType: 'special-holiday',
        userEmail: testEmail,
        userName: testUserName,
        holidayData: template
      })
    });
    
    const result = await response.json();
    
    if (result.success) {
      console.log(`✅ ${template.name} email sent successfully!`);
      console.log(`   Subject: ${template.subject}`);
      console.log(`   Discount: ${template.discountCode} (${template.discountPercent}%)`);
      console.log(`   Theme: ${template.theme}`);
      console.log('---');
    } else {
      console.log(`❌ Failed to send ${template.name} email:`, result.message);
    }
  } catch (error) {
    console.log(`❌ Error sending ${template.name} email:`, error.message);
  }
}

// Function to send all holiday emails
async function sendAllHolidayEmails() {
  console.log('🎉 Starting to send all holiday emails...\n');
  
  const holidays = Object.entries(holidayTemplates);
  
  for (const [key, template] of holidays) {
    await sendHolidayEmail(key, template);
    // Add delay between emails to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 2000));
  }
  
  console.log('\n🎊 All holiday emails sent!');
}

// Function to send specific holiday email
async function sendSpecificHoliday(holidayKey) {
  const template = holidayTemplates[holidayKey];
  if (template) {
    await sendHolidayEmail(holidayKey, template);
  } else {
    console.log(`❌ Holiday "${holidayKey}" not found. Available holidays:`);
    console.log(Object.keys(holidayTemplates).join(', '));
  }
}

// Function to list all available holidays
function listHolidays() {
  console.log('📅 Available Holiday Templates:\n');
  
  Object.entries(holidayTemplates).forEach(([key, template]) => {
    console.log(`${template.emoji} ${template.name}`);
    console.log(`   Key: ${key}`);
    console.log(`   Theme: ${template.theme}`);
    console.log(`   Discount: ${template.discountCode} (${template.discountPercent}%)`);
    console.log(`   Subject: ${template.subject}`);
    console.log('---');
  });
}

// Export functions for use
export {
  sendHolidayEmail,
  sendAllHolidayEmails,
  sendSpecificHoliday,
  listHolidays,
  holidayTemplates
};

// If running directly, show available holidays
if (import.meta.url === `file://${process.argv[1]}`) {
  listHolidays();
}
