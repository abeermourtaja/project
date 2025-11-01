import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Translation resources
const resources = {
  en: {
    translation: {
      // Common
      "Settings": "Settings",
      "Save Changes": "Save Changes",
      "Cancel": "Cancel",
      "Confirm": "Confirm",
      "Back": "Back",
      "Loading": "Loading",
      "Error": "Error",
      "Success": "Success",

      // Settings
      "Account details": "Account details",
      "Account Information": "Account Information",
      "Change Password": "Change Password",
      "Preferences": "Preferences",
      "Preferred Language": "Preferred Language",
      "Language": "Language",
      "Select Language": "Select Language",
      "Terms and Conditions": "Terms and Conditions",
      "Privacy Policy": "Privacy Policy",

      // Change Password
      "Current password": "Current password",
      "New password": "New password",
      "Confirm Password": "Confirm Password",
      "Passwords do not match!": "Passwords do not match!",
      "Please enter your current password": "Please enter your current password",
      "Please enter your new password": "Please enter your new password",
      "Please confirm your password": "Please confirm your password",

      // Messages
      "Please log in first": "Please log in first",
      "Password changed successfully!": "Password changed successfully!",
      "An error occurred while changing the password": "An error occurred while changing the password",
      "Preferred language saved!": "Preferred language saved!",
      "An error occurred while saving the language": "An error occurred while saving the language",

      // Notifications
      "Notifications": "Notifications",
      "Search notifications": "Search notifications",
      "No Notification yet!": "No Notification yet!",
      "Today": "Today",
      "An error occurred while loading notifications": "An error occurred while loading notifications",
    }
  },
  ar: {
    translation: {
      // Common
      "Settings": "الإعدادات",
      "Save Changes": "حفظ التغييرات",
      "Cancel": "إلغاء",
      "Confirm": "تأكيد",
      "Back": "رجوع",
      "Loading": "جارٍ التحميل",
      "Error": "خطأ",
      "Success": "نجح",

      // Settings
      "Account details": "تفاصيل الحساب",
      "Account Information": "معلومات الحساب",
      "Change Password": "تغيير كلمة المرور",
      "Preferences": "التفضيلات",
      "Preferred Language": "اللغة المفضلة",
      "Language": "اللغة",
      "Select Language": "اختر اللغة",
      "Terms and Conditions": "الشروط والأحكام",
      "Privacy Policy": "سياسة الخصوصية",

      // Change Password
      "Current password": "كلمة المرور الحالية",
      "New password": "كلمة المرور الجديدة",
      "Confirm Password": "تأكيد كلمة المرور",
      "Passwords do not match!": "كلمات المرور غير متطابقة!",
      "Please enter your current password": "يرجى إدخال كلمة المرور الحالية",
      "Please enter your new password": "يرجى إدخال كلمة المرور الجديدة",
      "Please confirm your password": "يرجى تأكيد كلمة المرور",

      // Messages
      "الرجاء تسجيل الدخول أولاً": "الرجاء تسجيل الدخول أولاً",
      "✅ تم تغيير كلمة المرور بنجاح!": "✅ تم تغيير كلمة المرور بنجاح!",
      "حدث خطأ أثناء تغيير كلمة المرور": "حدث خطأ أثناء تغيير كلمة المرور",
      "✅ تم حفظ اللغة المفضلة!": "✅ تم حفظ اللغة المفضلة!",
      "حدث خطأ أثناء حفظ اللغة": "حدث خطأ أثناء حفظ اللغة",

      // Notifications
      "Notifications": "الإشعارات",
      "Search notifications": "البحث في الإشعارات",
      "No Notification yet!": "لا توجد إشعارات بعد!",
      "Today": "اليوم",
      "An error occurred while loading notifications": "حدث خطأ أثناء تحميل الإشعارات",
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    debug: false,

    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    },

    detection: {
      order: ['localStorage', 'navigator'],
      lookupLocalStorage: 'preferredLanguage',
      caches: ['localStorage'],
    }
  });

export default i18n;
