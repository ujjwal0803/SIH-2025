import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import LoginModal from './LoginModal';

const CityConnect = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [language, setLanguage] = useState('EN');
  const [loginModal, setLoginModal] = useState({ isOpen: false, userType: 'citizen' });
  const [stats, setStats] = useState({
    totalReports: 1247,
    resolvedIssues: 892,
    activeCitizens: 3456,
    responseTime: '2.3 days'
  });

  // Animation variants
  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: "easeOut" }
  };

  const buttonHover = {
    hover: { 
      scale: 1.05,
      transition: { duration: 0.2 }
    },
    tap: { scale: 0.98 }
  };

  const handleLogin = (userType) => {
    setLoginModal({ isOpen: true, userType });
  };

  const closeLoginModal = () => {
    setLoginModal({ isOpen: false, userType: 'citizen' });
  };

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'EN' ? 'HI' : 'EN');
  };

  // Simulate loading stats
  useEffect(() => {
    const interval = setInterval(() => {
      setStats(prev => ({
        ...prev,
        totalReports: prev.totalReports + Math.floor(Math.random() * 3),
        activeCitizens: prev.activeCitizens + Math.floor(Math.random() * 5)
      }));
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const content = {
    EN: {
      title: "Report Civic Issues",
      subtitle: "Easily",
      description: "CityConnect is a platform dedicated to making your city a better place. Report issues, track their resolution, and engage with your local government to foster a stronger community.",
      citizenLogin: "Citizen Login / Register",
      adminLogin: "Admin Login",
      staffLogin: "Staff Login",
      about: "About",
      contact: "Contact",
      language: "Language",
      features: "Why Choose CityConnect?",
      feature1: "Quick Reporting",
      feature1Desc: "Report issues in seconds with our intuitive interface",
      feature2: "Real-time Tracking",
      feature2Desc: "Track the status of your reports in real-time",
      feature3: "Community Engagement",
      feature3Desc: "Connect with your community and local government",
      statsTitle: "Making a Difference",
      totalReports: "Total Reports",
      resolvedIssues: "Resolved Issues",
      activeCitizens: "Active Citizens",
      avgResponseTime: "Avg Response Time"
    },
    HI: {
      title: "नागरिक समस्याएं रिपोर्ट करें",
      subtitle: "आसानी से",
      description: "सिटीकनेक्ट आपके शहर को बेहतर बनाने के लिए समर्पित एक प्लेटफॉर्म है। समस्याओं की रिपोर्ट करें, उनके समाधान को ट्रैक करें, और एक मजबूत समुदाय बनाने के लिए अपनी स्थानीय सरकार के साथ जुड़ें।",
      citizenLogin: "नागरिक लॉगिन / पंजीकरण",
      adminLogin: "एडमिन लॉगिन",
      staffLogin: "स्टाफ लॉगिन",
      about: "के बारे में",
      contact: "संपर्क",
      language: "भाषा",
      features: "सिटीकनेक्ट क्यों चुनें?",
      feature1: "त्वरित रिपोर्टिंग",
      feature1Desc: "हमारे सहज इंटरफेस के साथ सेकंडों में समस्याओं की रिपोर्ट करें",
      feature2: "रीयल-टाइम ट्रैकिंग",
      feature2Desc: "अपनी रिपोर्टों की स्थिति को रीयल-टाइम में ट्रैक करें",
      feature3: "समुदायिक जुड़ाव",
      feature3Desc: "अपने समुदाय और स्थानीय सरकार से जुड़ें",
      statsTitle: "बदलाव लाना",
      totalReports: "कुल रिपोर्ट्स",
      resolvedIssues: "हल की गई समस्याएं",
      activeCitizens: "सक्रिय नागरिक",
      avgResponseTime: "औसत प्रतिक्रिया समय"
    }
  };

  const t = content[language];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <motion.header 
        className="bg-white shadow-sm sticky top-0 z-40"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            {/* Logo */}
            <motion.div 
              className="flex items-center space-x-2 cursor-pointer"
              whileHover={{ scale: 1.02 }}
            >
              <div className="w-8 h-8 bg-green-500 rounded flex items-center justify-center">
                <span className="text-white font-bold text-lg">L</span>
              </div>
              <span className="text-xl font-semibold text-gray-900">CityConnect</span>
            </motion.div>

            {/* Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <motion.a 
                href="#about" 
                className="text-gray-600 hover:text-gray-900 transition-colors"
                whileHover={{ y: -1 }}
              >
                {t.about}
              </motion.a>
              <motion.a 
                href="#contact" 
                className="text-gray-600 hover:text-gray-900 transition-colors"
                whileHover={{ y: -1 }}
              >
                {t.contact}
              </motion.a>
              <motion.button
                onClick={toggleLanguage}
                className="flex items-center space-x-1 text-gray-600 hover:text-gray-900 transition-colors"
                whileHover={{ y: -1 }}
              >
                <div className="w-4 h-4 rounded-full border border-gray-400 flex items-center justify-center">
                  <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                </div>
                <span>{language === 'EN' ? t.language : 'Language'}</span>
              </motion.button>
            </nav>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button className="text-gray-600 hover:text-gray-900">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center py-16 lg:py-24">
          {/* Left Column - Text Content */}
          <motion.div 
            className="space-y-8"
            variants={fadeInUp}
            initial="initial"
            animate="animate"
          >
            <div className="space-y-4">
              <motion.h1 
                className="text-4xl lg:text-5xl font-bold leading-tight"
                variants={fadeInUp}
              >
                <span className="text-gray-900">{t.title}</span>
                <br />
                <span className="text-green-500">{t.subtitle}</span>
              </motion.h1>
              
              <motion.p 
                className="text-lg text-gray-600 leading-relaxed max-w-md"
                variants={fadeInUp}
              >
                {t.description}
              </motion.p>
            </div>

            {/* Login Buttons */}
            <motion.div 
              className="flex flex-col sm:flex-row gap-4"
              variants={fadeInUp}
            >
              <motion.button
                onClick={() => handleLogin('citizen')}
                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-full font-medium transition-colors flex items-center justify-center"
                variants={buttonHover}
                whileHover="hover"
                whileTap="tap"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                {t.citizenLogin}
              </motion.button>
              
              <motion.button
                onClick={() => handleLogin('admin')}
                className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-full font-medium transition-colors flex items-center justify-center"
                variants={buttonHover}
                whileHover="hover"
                whileTap="tap"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {t.adminLogin}
              </motion.button>
              
              <motion.button
                onClick={() => handleLogin('staff')}
                className="bg-gray-700 hover:bg-gray-800 text-white px-6 py-3 rounded-full font-medium transition-colors flex items-center justify-center"
                variants={buttonHover}
                whileHover="hover"
                whileTap="tap"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                {t.staffLogin}
              </motion.button>
            </motion.div>
          </motion.div>

          {/* Right Column - Illustration with Stats */}
          <motion.div 
            className="relative"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="bg-white rounded-2xl shadow-xl p-8 relative overflow-hidden">
              {/* Main illustration */}
              <div className="aspect-square bg-gradient-to-br from-blue-50 to-green-50 rounded-xl flex items-center justify-center mb-6">
                <motion.div 
                  className="text-center space-y-4"
                  animate={{ 
                    y: [0, -10, 0],
                  }}
                  transition={{ 
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                    <svg className="w-10 h-10 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div className="text-sm text-gray-600 max-w-xs">
                    Citizens reporting issues and government staff resolving them efficiently
                  </div>
                </motion.div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-4 text-center">
                <motion.div 
                  className="bg-blue-50 rounded-lg p-3"
                  whileHover={{ scale: 1.05 }}
                >
                  <div className="text-2xl font-bold text-blue-600">{stats.totalReports.toLocaleString()}</div>
                  <div className="text-xs text-blue-500">{t.totalReports}</div>
                </motion.div>
                
                <motion.div 
                  className="bg-green-50 rounded-lg p-3"
                  whileHover={{ scale: 1.05 }}
                >
                  <div className="text-2xl font-bold text-green-600">{stats.resolvedIssues.toLocaleString()}</div>
                  <div className="text-xs text-green-500">{t.resolvedIssues}</div>
                </motion.div>
                
                <motion.div 
                  className="bg-purple-50 rounded-lg p-3"
                  whileHover={{ scale: 1.05 }}
                >
                  <div className="text-2xl font-bold text-purple-600">{stats.activeCitizens.toLocaleString()}</div>
                  <div className="text-xs text-purple-500">{t.activeCitizens}</div>
                </motion.div>
                
                <motion.div 
                  className="bg-orange-50 rounded-lg p-3"
                  whileHover={{ scale: 1.05 }}
                >
                  <div className="text-2xl font-bold text-orange-600">{stats.responseTime}</div>
                  <div className="text-xs text-orange-500">{t.avgResponseTime}</div>
                </motion.div>
              </div>

              {/* Floating elements */}
              <motion.div
                className="absolute top-4 right-4 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center"
                animate={{ 
                  rotate: [0, 360],
                  scale: [1, 1.1, 1]
                }}
                transition={{ 
                  duration: 4,
                  repeat: Infinity,
                  ease: "linear"
                }}
              >
                <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </motion.div>

              <motion.div
                className="absolute bottom-20 left-4 w-6 h-6 bg-blue-100 rounded-full"
                animate={{ 
                  y: [0, -20, 0],
                }}
                transition={{ 
                  duration: 2.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1
                }}
              />
            </div>
          </motion.div>
        </div>

        {/* Features Section */}
        <motion.section 
          className="py-16"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">{t.features}</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              {language === 'EN' 
                ? "Experience seamless civic engagement with our comprehensive platform designed for modern cities."
                : "आधुनिक शहरों के लिए डिज़ाइन किए गए हमारे व्यापक प्लेटफॉर्म के साथ निर्बाध नागरिक भागीदारी का अनुभव करें।"
              }
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: "⚡",
                title: t.feature1,
                description: t.feature1Desc,
                color: "from-blue-500 to-cyan-500"
              },
              {
                icon: "📊",
                title: t.feature2,
                description: t.feature2Desc,
                color: "from-green-500 to-emerald-500"
              },
              {
                icon: "🤝",
                title: t.feature3,
                description: t.feature3Desc,
                color: "from-purple-500 to-pink-500"
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
              >
                <div className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-xl flex items-center justify-center text-2xl mb-6`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* CTA Section */}
        <motion.section 
          className="py-16"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="bg-gradient-to-r from-blue-600 to-green-600 rounded-2xl text-white text-center py-16 px-8">
            <motion.h2 
              className="text-3xl lg:text-4xl font-bold mb-4"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              {language === 'EN' 
                ? "Ready to Make Your City Better?"
                : "अपने शहर को बेहतर बनाने के लिए तैयार हैं?"
              }
            </motion.h2>
            <motion.p 
              className="text-xl mb-8 opacity-90"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
            >
              {language === 'EN' 
                ? "Join thousands of citizens already making a difference in their communities."
                : "हजारों नागरिकों के साथ जुड़ें जो पहले से ही अपने समुदायों में बदलाव ला रहे हैं।"
              }
            </motion.p>
            <motion.button
              onClick={() => handleLogin('citizen')}
              className="bg-white text-blue-600 px-8 py-4 rounded-full font-semibold text-lg hover:bg-gray-50 transition-colors inline-flex items-center"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {language === 'EN' ? "Get Started Today" : "आज ही शुरू करें"}
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </motion.button>
          </div>
        </motion.section>
      </main>

      {/* Footer */}
      <motion.footer 
        className="bg-gray-900 text-white py-12"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-green-500 rounded flex items-center justify-center">
                  <span className="text-white font-bold text-lg">L</span>
                </div>
                <span className="text-xl font-semibold">CityConnect</span>
              </div>
              <p className="text-gray-400 mb-4">
                {language === 'EN'
                  ? "Empowering citizens to create positive change in their communities through technology and collaboration."
                  : "प्रौद्योगिकी और सहयोग के माध्यम से नागरिकों को अपने समुदायों में सकारात्मक बदलाव लाने के लिए सशक्त बनाना।"
                }
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">
                {language === 'EN' ? 'Quick Links' : 'त्वरित लिंक'}
              </h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">{t.about}</a></li>
                <li><a href="#" className="hover:text-white transition-colors">{t.contact}</a></li>
                <li><a href="#" className="hover:text-white transition-colors">
                  {language === 'EN' ? 'Privacy Policy' : 'गोपनीयता नीति'}
                </a></li>
                <li><a href="#" className="hover:text-white transition-colors">
                  {language === 'EN' ? 'Terms of Service' : 'सेवा की शर्तें'}
                </a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">
                {language === 'EN' ? 'Connect' : 'जुड़ें'}
              </h4>
              <div className="flex space-x-4">
                {['facebook', 'twitter', 'instagram', 'linkedin'].map((social) => (
                  <a
                    key={social}
                    href="#"
                    className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors"
                  >
                    <span className="sr-only">{social}</span>
                    <div className="w-5 h-5 bg-gray-400 rounded-full"></div>
                  </a>
                ))}
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; 2024 CityConnect. {language === 'EN' ? 'All rights reserved.' : 'सभी अधिकार सुरक्षित।'}</p>
          </div>
        </div>
      </motion.footer>

      {/* Background decorative elements */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-1/4 left-1/4 w-64 h-64 bg-green-100 rounded-full mix-blend-multiply filter blur-xl opacity-30"
          animate={{ 
            x: [0, 100, 0],
            y: [0, -100, 0],
          }}
          transition={{ 
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        <motion.div
          className="absolute top-3/4 right-1/4 w-64 h-64 bg-blue-100 rounded-full mix-blend-multiply filter blur-xl opacity-30"
          animate={{ 
            x: [0, -100, 0],
            y: [0, 100, 0],
          }}
          transition={{ 
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      </div>

      {/* Login Modal */}
      <LoginModal
        isOpen={loginModal.isOpen}
        onClose={closeLoginModal}
        userType={loginModal.userType}
      />
    </div>
  );
};

export default CityConnect;