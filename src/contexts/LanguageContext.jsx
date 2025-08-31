import { createContext, useContext, useState } from 'react'

const LanguageContext = createContext()

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState('en')

  const texts = {
    en: {
      // Navigation
      home: 'Home',
      dashboard: 'Dashboard',
      logout: 'Logout',
      login: 'Login',
      register: 'Register',
      getStarted: 'Get Started',
      
      // Hero Section
      heroTitle: 'Zentrox Core Team for Professional Tech Project Management',
      heroDesc: 'We are a specialized team in managing and executing tech projects, from idea to delivery, with precise follow-up and continuous client communication.',
      startProject: 'Start Your Project',
      goToDashboard: 'Go to Dashboard',
      contactSupport: 'Contact Support',
      
      // Features
      featuresTitle: 'Why Choose Zentrox Core?',
      featuresDesc: 'Experience the future of project management with a professional team and modern tools.',
      
      // Client Dashboard
      clientDashboard: 'Client Dashboard',
      newProject: 'New Project',
      noProjects: 'No projects yet',
      noProjectsDesc: 'Start by submitting your first project request',
      loadingProjects: 'Loading projects...',
      
      // Admin Dashboard
      adminDashboard: 'Admin Dashboard',
      teamManagement: 'Team Management',
      addAdmin: 'Add Admin',
      addTeamMember: 'Add Team Member',
      
      // Owner Dashboard
      ownerDashboard: 'Owner Dashboard',
      
      // Team Dashboard
      teamDashboard: 'Team Management',
      teamMembers: 'Team Members',
      totalMembers: 'Total Team Members',
      activeMembers: 'Active Members',
      totalProjects: 'Total Projects',
      activeProjects: 'Active Projects',
      noTeamMembers: 'No team members found',
      noTeamMembersDesc: 'No team members have been added yet',
      loadingTeamMembers: 'Loading team members...',
      searchTeamMembers: 'Search team members...',
      
      // Project Form
      submitProject: 'Submit Project',
      projectTitle: 'Project Title',
      projectDescription: 'Project Description',
      category: 'Category',
      budget: 'Budget',
      deadline: 'Deadline',
      cancel: 'Cancel',
      submitting: 'Submitting...',
      
      // Auth
      createAccount: 'Create Account',
      createClientAccount: 'Create Client Account',
      joinZentrox: 'Join Zentrox Core and start submitting your projects',
      clientAccount: 'Client Account',
      submitProjects: 'Submit projects and track progress',
      creatingAccount: 'Creating account...',
      createClientAccountBtn: 'Create Client Account',
      
      // Common
      backToHome: 'Back to Home',
      loading: 'Loading...',
      error: 'Error',
      success: 'Success',
      save: 'Save',
      edit: 'Edit',
      delete: 'Delete',
      view: 'View',
      status: 'Status',
      progress: 'Progress',
      date: 'Date',
      actions: 'Actions'
    },
    ar: {
      // Navigation
      home: 'الرئيسية',
      dashboard: 'لوحة التحكم',
      logout: 'تسجيل الخروج',
      login: 'تسجيل الدخول',
      register: 'إنشاء حساب',
      getStarted: 'ابدأ الآن',
      
      // Hero Section
      heroTitle: 'فريق زينتروكس كور لإدارة وتنفيذ المشاريع التقنية باحترافية',
      heroDesc: 'نحن فريق متخصص في إدارة وتنفيذ المشاريع التقنية من الفكرة حتى التسليم، مع متابعة دقيقة وتواصل مستمر مع العميل.',
      startProject: 'ابدأ مشروعك',
      goToDashboard: 'لوحة التحكم',
      contactSupport: 'تواصل معنا',
      
      // Features
      featuresTitle: 'لماذا تختار زينتروكس كور؟',
      featuresDesc: 'اختبر مستقبل إدارة المشاريع مع فريق محترف وأدوات حديثة.',
      
      // Client Dashboard
      clientDashboard: 'لوحة تحكم العميل',
      newProject: 'مشروع جديد',
      noProjects: 'لا توجد مشاريع بعد',
      noProjectsDesc: 'ابدأ بتقديم طلب مشروعك الأول',
      loadingProjects: 'جاري تحميل المشاريع...',
      
      // Admin Dashboard
      adminDashboard: 'لوحة تحكم المدير',
      teamManagement: 'إدارة الفريق',
      addAdmin: 'إضافة مدير',
      addTeamMember: 'إضافة عضو فريق',
      
      // Owner Dashboard
      ownerDashboard: 'لوحة تحكم المالك',
      
      // Team Dashboard
      teamDashboard: 'إدارة الفريق',
      teamMembers: 'أعضاء الفريق',
      totalMembers: 'إجمالي أعضاء الفريق',
      activeMembers: 'الأعضاء النشطين',
      totalProjects: 'إجمالي المشاريع',
      activeProjects: 'المشاريع النشطة',
      noTeamMembers: 'لا يوجد أعضاء فريق',
      noTeamMembersDesc: 'لم يتم إضافة أعضاء فريق بعد',
      loadingTeamMembers: 'جاري تحميل أعضاء الفريق...',
      searchTeamMembers: 'البحث في أعضاء الفريق...',
      
      // Project Form
      submitProject: 'تقديم المشروع',
      projectTitle: 'عنوان المشروع',
      projectDescription: 'وصف المشروع',
      category: 'الفئة',
      budget: 'الميزانية',
      deadline: 'الموعد النهائي',
      cancel: 'إلغاء',
      submitting: 'جاري التقديم...',
      
      // Auth
      createAccount: 'إنشاء حساب',
      createClientAccount: 'إنشاء حساب عميل',
      joinZentrox: 'انضم إلى زينتروكس كور وابدأ في تقديم مشاريعك',
      clientAccount: 'حساب العميل',
      submitProjects: 'تقديم المشاريع ومتابعة التقدم',
      creatingAccount: 'جاري إنشاء الحساب...',
      createClientAccountBtn: 'إنشاء حساب العميل',
      
      // Common
      backToHome: 'العودة للرئيسية',
      loading: 'جاري التحميل...',
      error: 'خطأ',
      success: 'نجح',
      save: 'حفظ',
      edit: 'تعديل',
      delete: 'حذف',
      view: 'عرض',
      status: 'الحالة',
      progress: 'التقدم',
      date: 'التاريخ',
      actions: 'الإجراءات'
    },
    fr: {
      // Navigation
      home: 'Accueil',
      dashboard: 'Tableau de bord',
      logout: 'Déconnexion',
      login: 'Connexion',
      register: 'S\'inscrire',
      getStarted: 'Commencer',
      
      // Hero Section
      heroTitle: 'Équipe Zentrox Core pour la gestion professionnelle de projets tech',
      heroDesc: 'Nous sommes une équipe spécialisée dans la gestion et la réalisation de projets technologiques, de l\'idée à la livraison, avec un suivi précis et une communication continue avec le client.',
      startProject: 'Commencer votre projet',
      goToDashboard: 'Tableau de bord',
      contactSupport: 'Contactez le support',
      
      // Features
      featuresTitle: 'Pourquoi choisir Zentrox Core ?',
      featuresDesc: 'Découvrez l\'avenir de la gestion de projet avec une équipe professionnelle et des outils modernes.',
      
      // Client Dashboard
      clientDashboard: 'Tableau de bord client',
      newProject: 'Nouveau projet',
      noProjects: 'Aucun projet pour le moment',
      noProjectsDesc: 'Commencez par soumettre votre première demande de projet',
      loadingProjects: 'Chargement des projets...',
      
      // Admin Dashboard
      adminDashboard: 'Tableau de bord administrateur',
      teamManagement: 'Gestion d\'équipe',
      addAdmin: 'Ajouter un administrateur',
      addTeamMember: 'Ajouter un membre d\'équipe',
      
      // Owner Dashboard
      ownerDashboard: 'Tableau de bord propriétaire',
      
      // Team Dashboard
      teamDashboard: 'Gestion d\'équipe',
      teamMembers: 'Membres de l\'équipe',
      totalMembers: 'Total des membres de l\'équipe',
      activeMembers: 'Membres actifs',
      totalProjects: 'Total des projets',
      activeProjects: 'Projets actifs',
      noTeamMembers: 'Aucun membre d\'équipe trouvé',
      noTeamMembersDesc: 'Aucun membre d\'équipe n\'a encore été ajouté',
      loadingTeamMembers: 'Chargement des membres de l\'équipe...',
      searchTeamMembers: 'Rechercher des membres d\'équipe...',
      
      // Project Form
      submitProject: 'Soumettre le projet',
      projectTitle: 'Titre du projet',
      projectDescription: 'Description du projet',
      category: 'Catégorie',
      budget: 'Budget',
      deadline: 'Date limite',
      cancel: 'Annuler',
      submitting: 'Soumission...',
      
      // Auth
      createAccount: 'Créer un compte',
      createClientAccount: 'Créer un compte client',
      joinZentrox: 'Rejoignez Zentrox Core et commencez à soumettre vos projets',
      clientAccount: 'Compte client',
      submitProjects: 'Soumettre des projets et suivre les progrès',
      creatingAccount: 'Création du compte...',
      createClientAccountBtn: 'Créer un compte client',
      
      // Common
      backToHome: 'Retour à l\'accueil',
      loading: 'Chargement...',
      error: 'Erreur',
      success: 'Succès',
      save: 'Enregistrer',
      edit: 'Modifier',
      delete: 'Supprimer',
      view: 'Voir',
      status: 'Statut',
      progress: 'Progrès',
      date: 'Date',
      actions: 'Actions'
    }
  }

  const t = (key) => {
    return texts[language][key] || key
  }

  const changeLanguage = (newLang) => {
    setLanguage(newLang)
  }

  return (
    <LanguageContext.Provider value={{ language, changeLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
} 