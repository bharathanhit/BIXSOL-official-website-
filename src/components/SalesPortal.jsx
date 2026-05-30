import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { db } from '../firebase';
import {
    collection, query, where, getDocs, onSnapshot,
    doc, getDoc, addDoc, updateDoc, arrayUnion, serverTimestamp, Timestamp
} from 'firebase/firestore';
import {
    Phone, Mail, MessageCircle, LogOut, RefreshCw,
    Target, TrendingUp, Users, CheckCircle, PhoneCall,
    Clock, ArrowRight, X, FileText, PhoneOff
} from 'lucide-react';
import './SalesPortal.css';

const SalesPortal = () => {
    const [isTeamEmpty, setIsTeamEmpty] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [salesperson, setSalesperson] = useState(null);
    const [loginCode, setLoginCode] = useState('');
    const [loginError, setLoginError] = useState('');
    const [loginLoading, setLoginLoading] = useState(false);

    // Check session on mount
    useEffect(() => {
        // Check if sales_team collection is empty to provide helpful setup instructions
        const checkTeam = async () => {
            try {
                const teamSnap = await getDocs(collection(db, 'sales_team'));
                if (teamSnap.empty) {
                    setIsTeamEmpty(true);
                }
            } catch (err) {
                console.error("Error checking sales team:", err);
            }
        };
        checkTeam();

        // 1. Check URL parameters for magic link auto-login
        const params = new URLSearchParams(window.location.search);
        const magicCode = params.get('code');
        const magicId = params.get('id');
        
        if (magicCode) {
            autoLoginByCode(magicCode.trim());
            window.history.replaceState({}, document.title, window.location.pathname);
            return;
        }

        if (magicId) {
            if (/^[0-9]{6}$/.test(magicId.trim())) {
                autoLoginByCode(magicId.trim());
            } else {
                autoLoginById(magicId.trim());
            }
            window.history.replaceState({}, document.title, window.location.pathname);
            return;
        }

        // 2. Check localStorage for persistent session
        const savedId = localStorage.getItem('bixsol_sp_id');
        const savedName = localStorage.getItem('bixsol_sp_name');
        const savedCode = localStorage.getItem('bixsol_sp_code');
        if (savedId && savedName) {
            setSalesperson({ id: savedId, name: savedName, password: savedCode || '' });
            setIsAuthenticated(true);
        }
    }, []);

    const autoLoginById = async (id) => {
        setLoginLoading(true);
        setLoginError('');
        try {
            const docRef = doc(db, 'sales_team', id);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                const data = docSnap.data();
                if (data.isActive === false) {
                    setLoginError('Your account has been deactivated. Contact admin.');
                } else {
                    const spData = { id: docSnap.id, name: data.name, ...data };
                    setSalesperson(spData);
                    setIsAuthenticated(true);
                    localStorage.setItem('bixsol_sp_id', docSnap.id);
                    localStorage.setItem('bixsol_sp_name', data.name);
                    localStorage.setItem('bixsol_sp_code', data.password || '');
                }
            } else {
                setLoginError('Magic Link is invalid or salesperson ID does not exist.');
            }
        } catch (err) {
            console.error('Magic link auto-login error:', err);
            setLoginError(`Login failed: ${err.message || 'Please check network/permissions.'}`);
        } finally {
            setLoginLoading(false);
        }
    };

    const autoLoginByCode = async (code) => {
        setLoginLoading(true);
        setLoginError('');
        try {
            const q = query(collection(db, 'sales_team'), where('password', '==', code));
            const querySnap = await getDocs(q);
            if (!querySnap.empty) {
                const docSnap = querySnap.docs[0];
                const data = docSnap.data();
                if (data.isActive === false) {
                    setLoginError('Your account has been deactivated. Contact admin.');
                } else {
                    const spData = { id: docSnap.id, name: data.name, ...data };
                    setSalesperson(spData);
                    setIsAuthenticated(true);
                    localStorage.setItem('bixsol_sp_id', docSnap.id);
                    localStorage.setItem('bixsol_sp_name', data.name);
                    localStorage.setItem('bixsol_sp_code', data.password || '');
                }
            } else {
                setLoginError('Magic Link is invalid or access code does not exist.');
            }
        } catch (err) {
            console.error('Magic code auto-login error:', err);
            setLoginError(`Login failed: ${err.message || 'Please check network/permissions.'}`);
        } finally {
            setLoginLoading(false);
        }
    };

    // ===== PORTAL STATE =====
    const [leads, setLeads] = useState([]);
    const [leadsLoading, setLeadsLoading] = useState(true);
    const [selectedLead, setSelectedLead] = useState(null);
    const [queueFilter, setQueueFilter] = useState('all');
    const [showCallModal, setShowCallModal] = useState(false);
    const [callOutcome, setCallOutcome] = useState('');
    const [callNotes, setCallNotes] = useState('');
    const [savingCall, setSavingCall] = useState(false);
    const [toast, setToast] = useState(null);

    const [aiQuery, setAiQuery] = useState('');
    const [aiLocation, setAiLocation] = useState('');
    const [aiBusinesses, setAiBusinesses] = useState([]);
    const [aiLoading, setAiLoading] = useState(false);
    const [aiError, setAiError] = useState('');
    const [aiSelectedIds, setAiSelectedIds] = useState(new Set());
    const [aiImportLoading, setAiImportLoading] = useState(false);

    const tamilNaduDistricts = [
        'Ariyalur', 'Chennai', 'Coimbatore', 'Cuddalore', 'Dharmapuri', 'Dindigul', 'Erode',
        'Kallakurichi', 'Kancheepuram', 'Karur', 'Krishnagiri', 'Madurai', 'Mayiladuthurai',
        'Nagapattinam', 'Namakkal', 'Nilgiris', 'Perambalur', 'Pudukkottai', 'Ramanathapuram',
        'Ranipet', 'Salem', 'Sivaganga', 'Tenkasi', 'Thanjavur', 'Theni', 'Thoothukudi',
        'Tiruchirappalli', 'Tirunelveli', 'Tiruppur', 'Tiruvallur', 'Tiruvannamalai', 'Tiruvarur',
        'Vellore', 'Villupuram', 'Virudhunagar',
        'Chennai North', 'Chennai South', 'Chennai West', 'Coimbatore East', 'Coimbatore West',
        'Madurai Central', 'Salem City', 'Trichy Central', 'Tiruppur City', 'Theni District',
        'Tirunelveli District', 'Kattankulathur', 'Tambaram', 'Velachery', 'Anna Nagar'
    ];

    // ===== TOAST HELPER =====
    const showToast = (message) => {
        setToast(message);
        setTimeout(() => setToast(null), 3000);
    };

    const toggleAiBusinessSelection = (businessId) => {
        setAiSelectedIds(prev => {
            const next = new Set(prev);
            if (next.has(businessId)) next.delete(businessId);
            else next.add(businessId);
            return next;
        });
    };

    const FALLBACK_AI_BUSINESSES = [
        { id: 'fallback-001', name: 'Theni Auto Repairs', phone: '+91 98765 43210', address: 'Sivaganga Road, Theni', website: '' },
        { id: 'fallback-002', name: 'Madurai Textile Traders', phone: '+91 97654 32109', address: 'Pazhanganatham, Madurai', website: '' },
        { id: 'fallback-003', name: 'Coimbatore Catering Services', phone: '+91 96543 21098', address: 'R.S. Puram, Coimbatore', website: '' },
        { id: 'fallback-004', name: 'Salem Salon Studio', phone: '+91 95432 10987', address: 'Ammapet, Salem', website: '' },
        { id: 'fallback-005', name: 'Tiruppur Plumbing Works', phone: '+91 94321 09876', address: 'Kangeyam Road, Tiruppur', website: '' }
    ];

    const COLD_CALL_SUGGESTIONS = [
        'Salon',
        'Auto Repair',
        'Restaurant',
        'Plumbing',
        'Gym',
        'Tutor',
        'Dental Clinic',
        'AC Service',
        'Catering',
    ];

    const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
    const SCRAPER_API_KEY = import.meta.env.VITE_SCRAPER_API_KEY;

    const normalizeBusiness = (item) => ({
        id: item.place_id || item.uuid || item.local_id || item.position?.toString() || item.name || `biz-${Math.random().toString(36).slice(2, 10)}`,
        name: item.name || item.title || item.name_raw || 'Unknown Business',
        phone: item.phone || item.phone_number || item.international_phone_number || item.displayed_phone || item.formatted_phone_number || '',
        address: item.address || item.raw_address || item.localized_address || item.formatted_address || '',
        website: item.website || item.website_url || item.url || '',
        mapUrl: item.mapUrl || item.url || item.map_url || item.website || 'https://www.google.com/maps',
        source: item.source || 'Unknown',
        rating: item.rating || ''
    });

    const buildBrowserGoogleTextSearchUrl = ({ query, location }) => {
        const searchQuery = `${query}${location ? ` in ${location}` : ' in Tamil Nadu'}`.trim();
        const params = new URLSearchParams({
            query: searchQuery,
            key: GOOGLE_MAPS_API_KEY,
            region: 'in',
            language: 'en'
        });
        return `https://maps.googleapis.com/maps/api/place/textsearch/json?${params.toString()}`;
    };

    const buildBrowserGoogleDetailsUrl = (placeId) => {
        const params = new URLSearchParams({
            place_id: placeId,
            fields: 'name,formatted_address,formatted_phone_number,website,geometry,place_id,rating',
            key: GOOGLE_MAPS_API_KEY,
            language: 'en'
        });
        return `https://maps.googleapis.com/maps/api/place/details/json?${params.toString()}`;
    };

    const fetchBrowserGoogleMapsBusinesses = async ({ query, location, limit }) => {
        const searchUrl = buildBrowserGoogleTextSearchUrl({ query, location });
        const searchResponse = await fetch(searchUrl);
        const searchResult = await searchResponse.json();

        if (searchResult.status !== 'OK' && searchResult.status !== 'ZERO_RESULTS') {
            throw new Error(searchResult.error_message || `Google Maps API error: ${searchResult.status}`);
        }

        const candidates = Array.isArray(searchResult.results) ? searchResult.results.slice(0, limit) : [];
        const detailsPromises = candidates.map(async (candidate) => {
            if (!candidate.place_id) return null;
            const detailsUrl = buildBrowserGoogleDetailsUrl(candidate.place_id);
            const detailsResponse = await fetch(detailsUrl);
            const detailsResult = await detailsResponse.json();
            if (detailsResult.status !== 'OK') return null;
            return normalizeBusiness({
                place_id: candidate.place_id,
                name: detailsResult.result.name || candidate.name,
                phone: detailsResult.result.formatted_phone_number || '',
                address: detailsResult.result.formatted_address || candidate.formatted_address || '',
                website: detailsResult.result.website || '',
                url: `https://www.google.com/maps/place/?q=place_id:${candidate.place_id}`,
                rating: detailsResult.result.rating || candidate.rating || '',
                source: 'Google Maps'
            });
        });

        return (await Promise.all(detailsPromises)).filter(Boolean).filter(item => item.name && !item.website).slice(0, limit);
    };

    const buildBrowserSerpApiUrl = ({ query, location, limit }) => {
        const searchQuery = `${query}${location ? ` ${location}` : ''}`.trim();
        const params = new URLSearchParams({
            engine: 'google_maps',
            q: searchQuery,
            api_key: SCRAPER_API_KEY,
            google_domain: 'google.com',
            hl: 'en',
            num: String(limit || 10)
        });
        return `https://serpapi.com/search.json?${params.toString()}`;
    };

    const fetchBrowserSerpBusinesses = async ({ query, location, limit }) => {
        const url = buildBrowserSerpApiUrl({ query, location, limit });
        const response = await fetch(url);
        const result = await response.json();
        const rawBusinesses = result.local_results || result.nearby_results || result.results || [];
        return Array.isArray(rawBusinesses)
            ? rawBusinesses.map(normalizeBusiness).filter(item => item.name && !item.website).slice(0, limit)
            : [];
    };

    const fetchBrowserBusinesses = async ({ query, location, limit }) => {
        if (GOOGLE_MAPS_API_KEY) {
            return fetchBrowserGoogleMapsBusinesses({ query, location, limit });
        }
        if (SCRAPER_API_KEY) {
            return fetchBrowserSerpBusinesses({ query, location, limit });
        }
        throw new Error('No browser API key configured for direct business search.');
    };

    const fetchAiBusinesses = async () => {
        if (!aiQuery.trim()) {
            setAiError('Please enter a category or business type to search.');
            return;
        }

        setAiLoading(true);
        setAiError('');
        setAiBusinesses([]);
        setAiSelectedIds(new Set());

        try {
            const response = await fetch('/.netlify/functions/scrape-businesses', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    query: aiQuery.trim(),
                    location: aiLocation.trim(),
                    limit: 15
                })
            });

            const text = await response.text();
            let result = null;
            try {
                result = text ? JSON.parse(text) : null;
            } catch (parseErr) {
                throw new Error(`Invalid JSON response from business scraper${text ? `: ${text}` : ''}`);
            }

            if (!response.ok) {
                const remoteError = (result && result.error) ? result.error : `Failed to fetch AI businesses (${response.status})`;
                throw new Error(remoteError);
            }

            const businesses = Array.isArray(result?.businesses) ? result.businesses : [];
            if (businesses.length === 0) {
                setAiError('No prospects were found. Try a broader search or a different category.');
            }
            setAiBusinesses(businesses);
            setAiSelectedIds(new Set(businesses.map(b => b.id)));
        } catch (err) {
            const browserHasKey = Boolean(GOOGLE_MAPS_API_KEY || SCRAPER_API_KEY);
            if (browserHasKey) {
                try {
                    const directBusinesses = await fetchBrowserBusinesses({
                        query: aiQuery.trim(),
                        location: aiLocation.trim(),
                        limit: 15
                    });
                    if (directBusinesses.length > 0) {
                        setAiBusinesses(directBusinesses);
                        setAiSelectedIds(new Set(directBusinesses.map(b => b.id)));
                        setAiError(`Using direct browser API search because local function was unavailable.`);
                        return;
                    }
                    setAiError('No businesses were found using direct API search. Showing demo businesses.');
                } catch (directErr) {
                    console.warn('Direct browser search failed:', directErr);
                    setAiError(`Direct browser search failed: ${directErr.message || 'Unknown error'}`);
                }
            } else {
                setAiError(err.message && err.message.includes('not available locally')
                    ? 'Netlify function unavailable locally. Showing demo businesses.'
                    : err.message || 'Failed to fetch AI businesses');
            }
            setAiBusinesses(FALLBACK_AI_BUSINESSES);
            setAiSelectedIds(new Set(FALLBACK_AI_BUSINESSES.map(b => b.id)));
        } finally {
            setAiLoading(false);
        }
    };

    const importAiBusinessLeads = async () => {
        const selected = aiBusinesses.filter(item => aiSelectedIds.has(item.id));
        if (selected.length === 0) {
            showToast('⚠️ Select at least one business to import');
            return;
        }

        setAiImportLoading(true);
        try {
            const promises = selected.map(item => addDoc(collection(db, 'sales_leads'), {
                name: item.name,
                phone: item.phone || '',
                email: item.email || '',
                whatsapp: item.phone || '',
                website: item.website || '',
                address: item.address || '',
                notes: `AI Business Hunter lead${item.address ? ` • ${item.address}` : ''}`,
                source: 'AI Business Hunter',
                assignedTo: salesperson?.id || null,
                createdAt: serverTimestamp(),
                hasWebsite: !!item.website,
                scrapedAt: new Date().toISOString()
            }));

            const results = await Promise.allSettled(promises);
            const successCount = results.filter(r => r.status === 'fulfilled').length;
            showToast(`✅ Imported ${successCount} business lead${successCount !== 1 ? 's' : ''}`);
            setAiBusinesses([]);
            setAiSelectedIds(new Set());
            setAiQuery('');
            setAiLocation('');
        } catch (err) {
            console.error('AI lead import error:', err);
            showToast('❌ Failed to import AI business leads');
        } finally {
            setAiImportLoading(false);
        }
    };

    // ===== LOGIN HANDLER (Supports 6-digit access code) =====
    const handleLogin = async (e) => {
        e.preventDefault();
        const input = loginCode.trim();
        if (!input) {
            setLoginError('Please enter your 6-digit access code');
            return;
        }

        if (!/^[0-9]{6}$/.test(input)) {
            setLoginError('Access code must be exactly 6 digits');
            return;
        }

        setLoginLoading(true);
        setLoginError('');

        try {
            await new Promise(resolve => setTimeout(resolve, 400));
            let spDoc = null;
            const q = query(collection(db, 'sales_team'), where('password', '==', input));
            const querySnap = await getDocs(q);
            if (!querySnap.empty) {
                spDoc = querySnap.docs[0];
            }

            if (spDoc) {
                const data = spDoc.data();
                if (data.isActive === false) {
                    setLoginError('Your account has been deactivated. Contact admin.');
                } else {
                    const spData = { id: spDoc.id, name: data.name, ...data };
                    setSalesperson(spData);
                    setIsAuthenticated(true);
                    localStorage.setItem('bixsol_sp_id', spDoc.id);
                    localStorage.setItem('bixsol_sp_name', data.name);
                    localStorage.setItem('bixsol_sp_code', data.password || '');
                }
            } else {
                setLoginError('Could not find account matching that access code.');
            }
        } catch (err) {
            console.error('Login error:', err);
            setLoginError(`Login failed: ${err.message || 'Please check network/permissions.'}`);
        } finally {
            setLoginLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('bixsol_sp_id');
        localStorage.removeItem('bixsol_sp_name');
        localStorage.removeItem('bixsol_sp_code');
        setIsAuthenticated(false);
        setSalesperson(null);
        setLoginCode('');
        setSelectedLead(null);
        setLeads([]);
    };

    // ===== FIRESTORE: ASSIGNED LEADS =====
    useEffect(() => {
        if (!isAuthenticated || !salesperson) return;

        setLeadsLoading(true);
        const q = query(
            collection(db, 'sales_leads'),
            where('assignedTo', '==', salesperson.id)
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const leadsData = [];
            snapshot.forEach((doc) => {
                leadsData.push({ id: doc.id, ...doc.data() });
            });
            
            // Client-side sort by createdAt descending to avoid requiring a composite Firestore index
            leadsData.sort((a, b) => {
                const dateA = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(a.createdAt || 0);
                const dateB = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(b.createdAt || 0);
                return dateB - dateA;
            });

            setLeads(leadsData);
            setLeadsLoading(false);

            // Update selected lead if it's in the list
            if (selectedLead) {
                const updated = leadsData.find(l => l.id === selectedLead.id);
                if (updated) setSelectedLead(updated);
            }
        }, (err) => {
            console.error('Error fetching leads:', err);
            setLeadsLoading(false);
        });

        return () => unsubscribe();
    }, [isAuthenticated, salesperson]);

    // ===== CONTACT HELPERS =====
    const callContact = (phone) => {
        if (phone) window.open(`tel:${phone}`);
    };

    const whatsappContact = (phone, message = '') => {
        if (!phone) return;
        const clean = phone.replace(/[^0-9]/g, '');
        const url = message
            ? `https://wa.me/${clean}?text=${encodeURIComponent(message)}`
            : `https://wa.me/${clean}`;
        window.open(url, '_blank');
    };

    const emailContact = (email) => {
        if (email) window.open(`mailto:${email}`);
    };

    // ===== CALL LOGGER =====
    const openCallLogger = (lead) => {
        setSelectedLead(lead);
        setCallOutcome('');
        setCallNotes('');
        setShowCallModal(true);
    };

    const saveCallLog = async () => {
        if (!callOutcome || !selectedLead) return;

        setSavingCall(true);
        try {
            const callEntry = {
                outcome: callOutcome,
                notes: callNotes.trim(),
                calledBy: salesperson.id,
                calledByName: salesperson.name,
                timestamp: new Date().toISOString()
            };

            // Determine new lead status based on outcome
            let newStatus = selectedLead.status;
            if (callOutcome === 'interested') newStatus = 'interested';
            else if (callOutcome === 'not_interested') newStatus = 'not_interested';
            else if (callOutcome === 'converted') newStatus = 'converted';
            else if (callOutcome === 'no_answer' || callOutcome === 'callback') newStatus = 'contacted';
            else if (callOutcome === 'wrong_number') newStatus = 'not_interested';

            await updateDoc(doc(db, 'sales_leads', selectedLead.id), {
                callLog: arrayUnion(callEntry),
                lastCalledAt: serverTimestamp(),
                status: newStatus
            });

            setShowCallModal(false);
            showToast('✅ Call logged successfully');
        } catch (err) {
            console.error('Error saving call log:', err);
            showToast('❌ Failed to save call log');
        } finally {
            setSavingCall(false);
        }
    };

    // ===== COMPUTED VALUES =====
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];

    const todaysCalls = useMemo(() => {
        let count = 0;
        leads.forEach(lead => {
            if (lead.callLog && Array.isArray(lead.callLog)) {
                lead.callLog.forEach(call => {
                    if (call.calledBy === salesperson?.id) {
                        const callDate = call.timestamp?.split?.('T')?.[0];
                        if (callDate === todayStr) count++;
                    }
                });
            }
        });
        return count;
    }, [leads, salesperson, todayStr]);

    const stats = useMemo(() => ({
        total: leads.length,
        called: leads.filter(l => l.callLog && l.callLog.length > 0).length,
        interested: leads.filter(l => l.status === 'interested').length,
        converted: leads.filter(l => l.status === 'converted').length
    }), [leads]);

    const filteredLeads = useMemo(() => {
        if (queueFilter === 'all') return leads;
        if (queueFilter === 'pending') return leads.filter(l => !l.callLog || l.callLog.length === 0);
        if (queueFilter === 'called') return leads.filter(l => l.callLog && l.callLog.length > 0);
        return leads.filter(l => l.status === queueFilter);
    }, [leads, queueFilter]);

    const progressPercent = leads.length > 0 ? Math.round((stats.called / leads.length) * 100) : 0;

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Good Morning';
        if (hour < 17) return 'Good Afternoon';
        return 'Good Evening';
    };

    const formatCallTime = (timestamp) => {
        if (!timestamp) return '';
        try {
            const date = new Date(timestamp);
            const now = new Date();
            const isToday = date.toDateString() === now.toDateString();
            if (isToday) {
                return `Today ${date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}`;
            }
            return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) +
                ' ' + date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
        } catch {
            return '';
        }
    };

    const hasBeenCalledToday = (lead) => {
        if (!lead.callLog || !Array.isArray(lead.callLog)) return false;
        return lead.callLog.some(call => {
            if (call.calledBy !== salesperson?.id) return false;
            const callDate = call.timestamp?.split?.('T')?.[0];
            return callDate === todayStr;
        });
    };

    const outcomes = [
        { key: 'no_answer', label: '📵 No Answer', emoji: '📵' },
        { key: 'interested', label: '🎯 Interested', emoji: '🎯' },
        { key: 'not_interested', label: '👎 Not Interested', emoji: '👎' },
        { key: 'callback', label: '🔄 Call Back', emoji: '🔄' },
        { key: 'converted', label: '🏆 Converted', emoji: '🏆' },
        { key: 'wrong_number', label: '❌ Wrong Number', emoji: '❌' }
    ];

    // ===== LOGIN SCREEN =====
    if (!isAuthenticated) {
        return (
            <div className="sp-login-container">
                <motion.div
                    className="sp-login-card"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                >
                    <div className="sp-login-icon-wrap">
                        <PhoneCall size={32} />
                    </div>
                    <h2>Sales <span className="gradient-text">Portal</span></h2>
                    <p className="sp-login-subtitle">
                        Enter your 6-digit portal access code to access your cold-calling dashboard
                    </p>

                   

{isTeamEmpty && (
    <div className="sp-team-empty-warning" style={{
        background: 'rgba(239, 68, 68, 0.1)',
        border: '1px solid rgba(239, 68, 68, 0.3)',
        borderRadius: '8px',
        padding: '0.8rem 1rem',
        marginBottom: '1.2rem',
        fontSize: '0.88rem',
        color: '#f87171',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.4rem',
        textAlign: 'left'
    }}>
        <div style={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            ⚠️ No salesperson account found
        </div>
        <p style={{ margin: 0, opacity: 0.85, lineHeight: 1.4 }}>
            Please create a salesperson account before accessing the portal.
        </p>
    </div>
)}
<form onSubmit={handleLogin} className="sp-login-form">
    <div className="sp-input-group">
        <label htmlFor="sp-id">Access Code</label>
        <div className="sp-input-field">
            <input
                id="sp-id"
                type="text"
                value={loginCode}
                onChange={(e) => setLoginCode(e.target.value)}
                placeholder="e.g. 123456"
                disabled={loginLoading}
                autoFocus
                autoComplete="off"
            />
        </div>
    </div>

    {loginError && (
        <motion.div
            className="sp-login-error"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
        >
            {loginError}
        </motion.div>
    )}

    <button type="submit" className="sp-login-btn" disabled={loginLoading}>
        {loginLoading ? (
            <RefreshCw className="spinning" size={18} />
        ) : (
            <>
                <ArrowRight size={18} />
                Access Portal
            </>
        )}
    </button>
</form>
                </motion.div>
            </div>
        );
    }

    // ===== LOADING =====
    if (leadsLoading) {
        return (
            <div className="sp-loading">
                <RefreshCw className="spinning" size={40} />
                <p>Loading your dashboard...</p>
            </div>
        );
    }

    // ===== MAIN PORTAL =====
    return (
        <div className="sp-container">
            {/* Toast */}
            <AnimatePresence>
                {toast && (
                    <motion.div
                        className="sp-toast"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                    >
                        {toast}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Top Bar */}
            <header className="sp-topbar">
                <div className="sp-topbar-left">
                    <img src="/logo.jpg" alt="BIXSOL" className="sp-topbar-logo" />
                    <div className="sp-topbar-title">
                        <h1>Cold Call <span className="gradient-text">Dashboard</span></h1>
                        <span>{new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</span>
                    </div>
                </div>
                <div className="sp-topbar-right">
                    <div className="sp-user-info">
                        <div className="sp-user-avatar">
                            {salesperson?.name?.charAt(0)?.toUpperCase() || 'S'}
                        </div>
                        <div>
                            <div className="sp-user-name">{salesperson?.name}</div>
                            <div className="sp-user-id">Code: {salesperson?.password}</div>
                        </div>
                    </div>
                    <button className="sp-logout-btn" onClick={handleLogout}>
                        <LogOut size={14} /> Logout
                    </button>
                </div>
            </header>

            {/* Main Content */}
            <main className="sp-main">
                {/* Greeting */}
                <div className="sp-greeting">
                    <h2>{getGreeting()}, <span className="gradient-text">{salesperson?.name?.split(' ')[0]}</span> 👋</h2>
                    <div className="sp-greeting-date">
                        <Clock size={14} />
                        {todaysCalls} calls made today · {leads.length} leads assigned
                    </div>
                </div>

                {/* Stats */}
                <div className="sp-stats-row">
                    <div className="sp-stat-card">
                        <div className="sp-stat-icon total"><Target size={24} /></div>
                        <div className="sp-stat-info">
                            <span className="sp-stat-label">Total Leads</span>
                            <span className="sp-stat-value">{stats.total}</span>
                        </div>
                    </div>
                    <div className="sp-stat-card">
                        <div className="sp-stat-icon called"><PhoneCall size={24} /></div>
                        <div className="sp-stat-info">
                            <span className="sp-stat-label">Called</span>
                            <span className="sp-stat-value">{stats.called}</span>
                        </div>
                    </div>
                    <div className="sp-stat-card">
                        <div className="sp-stat-icon interested"><TrendingUp size={24} /></div>
                        <div className="sp-stat-info">
                            <span className="sp-stat-label">Interested</span>
                            <span className="sp-stat-value">{stats.interested}</span>
                        </div>
                    </div>
                    <div className="sp-stat-card">
                        <div className="sp-stat-icon converted"><CheckCircle size={24} /></div>
                        <div className="sp-stat-info">
                            <span className="sp-stat-label">Converted</span>
                            <span className="sp-stat-value">{stats.converted}</span>
                        </div>
                    </div>
                </div>

                {/* AI Business Hunter */}
                <div className="sp-ai-hunter-section">
                    <div className="sp-ai-hunter-header">
                        <div>
                            <h3>🤖 AI Business Hunter</h3>
                            <p>Find strong local cold-call prospects and import their business info, phone number, and location into your lead list.</p>
                        </div>
                        <button
                            className="sp-ai-hunter-button"
                            onClick={fetchAiBusinesses}
                            disabled={aiLoading}
                        >
                            {aiLoading ? 'Searching…' : 'Find Businesses'}
                        </button>
                    </div>
                    <div className="sp-ai-hunter-form">
                        <div className="sp-ai-hunter-field">
                            <label>Business category or keyword</label>
                            <input
                                type="text"
                                value={aiQuery}
                                onChange={(e) => setAiQuery(e.target.value)}
                                placeholder="e.g. salons, restaurants, plumbing"
                            />
                        </div>
                        <div className="sp-ai-hunter-field">
                            <label>Location (Tamil Nadu district / city)</label>
                            <input
                                type="text"
                                list="tn-districts"
                                value={aiLocation}
                                onChange={(e) => setAiLocation(e.target.value)}
                                placeholder="e.g. Chennai, Coimbatore, Tenkasi, Virudhunagar"
                            />
                            <datalist id="tn-districts">
                                {tamilNaduDistricts.map((district) => (
                                    <option key={district} value={district} />
                                ))}
                            </datalist>
                        </div>
                    </div>
                    <div className="sp-ai-suggestions">
                        <span>Try one of these high-conversion categories:</span>
                        <div className="sp-ai-suggestions-list">
                            {COLD_CALL_SUGGESTIONS.map((suggestion) => (
                                <button
                                    key={suggestion}
                                    type="button"
                                    className="sp-ai-hunter-button secondary"
                                    onClick={() => setAiQuery(suggestion)}
                                >
                                    {suggestion}
                                </button>
                            ))}
                        </div>
                    </div>
                    {aiError && (
                        <div className="sp-ai-error">{aiError}</div>
                    )}
                    {aiBusinesses.length > 0 && (
                        <div className="sp-ai-results">
                            <div className="sp-ai-results-header">
                                <span>{aiBusinesses.length} business prospects found</span>
                                <button
                                    className="sp-ai-hunter-button secondary"
                                    onClick={importAiBusinessLeads}
                                    disabled={aiImportLoading}
                                >
                                    {aiImportLoading ? 'Importing…' : 'Import Selected Leads'}
                                </button>
                            </div>
                            <div className="sp-ai-results-list">
                                {aiBusinesses.map((business) => (
                                    <div key={business.id} className="sp-ai-result-row">
                                        <div className="sp-ai-result-checkbox">
                                            <input
                                                type="checkbox"
                                                checked={aiSelectedIds.has(business.id)}
                                                onChange={() => toggleAiBusinessSelection(business.id)}
                                            />
                                        </div>
                                        <div className="sp-ai-result-details">
                                            <div className="sp-ai-result-header">
                                                <div className="sp-ai-result-name">{business.name}</div>
                                                {business.source && <span className="sp-ai-result-badge">{business.source}</span>}
                                            </div>
                                            <div className="sp-ai-result-meta">
                                                <span>{business.phone || 'No phone available'}</span>
                                                {business.address && <span>• {business.address}</span>}
                                                {business.rating && <span>• ⭐ {business.rating}</span>}
                                            </div>
                                            {business.website && <div className="sp-ai-result-website">Website found: {business.website}</div>}
                                            <div className="sp-ai-result-actions">
                                                {business.mapUrl && (
                                                    <a href={business.mapUrl} target="_blank" rel="noreferrer" className="sp-ai-result-link">
                                                        View on Google Maps
                                                    </a>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Progress Bar */}
                <div className="sp-progress-section">
                    <div className="sp-progress-header">
                        <div className="sp-progress-title">
                            <TrendingUp size={16} /> Overall Progress
                        </div>
                        <div className="sp-progress-count">{stats.called} / {stats.total} leads contacted</div>
                    </div>
                    <div className="sp-progress-bar-track">
                        <motion.div
                            className="sp-progress-bar-fill"
                            initial={{ width: 0 }}
                            animate={{ width: `${progressPercent}%` }}
                            transition={{ duration: 1, ease: 'easeOut' }}
                        />
                    </div>
                </div>

                {/* Content Grid: Queue + Detail */}
                <div className="sp-content-grid">
                    {/* Call Queue */}
                    <div className="sp-queue-section">
                        <div className="sp-queue-header">
                            <h3>
                                📋 Call Queue
                                <span className="sp-queue-header-badge">{filteredLeads.length}</span>
                            </h3>
                            <div className="sp-queue-filters">
                                {['all', 'pending', 'called', 'interested', 'converted'].map(f => (
                                    <button
                                        key={f}
                                        className={`sp-queue-filter-btn ${queueFilter === f ? 'active' : ''}`}
                                        onClick={() => setQueueFilter(f)}
                                    >
                                        {f.charAt(0).toUpperCase() + f.slice(1)}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="sp-queue-list">
                            {filteredLeads.length === 0 ? (
                                <div className="sp-queue-empty">
                                    <div className="sp-queue-empty-icon">📭</div>
                                    <p>{leads.length === 0
                                        ? 'No leads assigned yet. Contact your admin.'
                                        : 'No leads match this filter.'
                                    }</p>
                                </div>
                            ) : (
                                filteredLeads.map(lead => (
                                    <motion.div
                                        key={lead.id}
                                        className={`sp-lead-card ${selectedLead?.id === lead.id ? 'active' : ''} ${hasBeenCalledToday(lead) ? 'called' : ''}`}
                                        onClick={() => setSelectedLead(lead)}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <div className="sp-lead-avatar">
                                            {lead.name?.charAt(0)?.toUpperCase() || '?'}
                                        </div>
                                        <div className="sp-lead-info">
                                            <div className="sp-lead-name">
                                                <span className={`sp-lead-status-dot ${lead.status}`}></span>
                                                {lead.name}
                                                {hasBeenCalledToday(lead) && <span style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.3)' }}>✓ Called today</span>}
                                            </div>
                                            <div className="sp-lead-meta">
                                                {lead.phone || lead.email || 'No contact info'}
                                            </div>
                                        </div>
                                        <div className="sp-lead-quick-actions" onClick={(e) => e.stopPropagation()}>
                                            <button
                                                className="sp-lead-quick-btn call"
                                                onClick={() => callContact(lead.phone)}
                                                title="Call"
                                            >
                                                <Phone size={14} />
                                            </button>
                                            <button
                                                className="sp-lead-quick-btn wa"
                                                onClick={() => whatsappContact(lead.whatsapp || lead.phone)}
                                                title="WhatsApp"
                                            >
                                                <MessageCircle size={14} />
                                            </button>
                                            <button
                                                className="sp-lead-quick-btn email"
                                                onClick={() => emailContact(lead.email)}
                                                title="Email"
                                            >
                                                <Mail size={14} />
                                            </button>
                                        </div>
                                    </motion.div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Detail Panel */}
                    <AnimatePresence mode="wait">
                        {selectedLead ? (
                            <motion.div
                                key={selectedLead.id}
                                className="sp-detail-panel"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                transition={{ duration: 0.25 }}
                            >
                                <div className="sp-detail-header">
                                    <h3>Lead Details</h3>
                                    <button className="sp-detail-close" onClick={() => setSelectedLead(null)}>&times;</button>
                                </div>
                                <div className="sp-detail-body">
                                    {/* Profile */}
                                    <div className="sp-detail-profile">
                                        <div className="sp-detail-avatar">
                                            {selectedLead.name?.charAt(0)?.toUpperCase() || '?'}
                                        </div>
                                        <div className="sp-detail-name">{selectedLead.name}</div>
                                        <span className={`sp-detail-status ${selectedLead.status}`}>
                                            {selectedLead.status?.replace('_', ' ')}
                                        </span>
                                    </div>

                                    {/* Contact Info */}
                                    <div className="sp-detail-section">
                                        <h4>Contact Information</h4>
                                        {selectedLead.phone && (
                                            <div className="sp-contact-row">
                                                <Phone size={15} />
                                                <span>{selectedLead.phone}</span>
                                            </div>
                                        )}
                                        {selectedLead.email && (
                                            <div className="sp-contact-row">
                                                <Mail size={15} />
                                                <span>{selectedLead.email}</span>
                                            </div>
                                        )}
                                        {(selectedLead.whatsapp || selectedLead.phone) && (
                                            <div className="sp-contact-row">
                                                <MessageCircle size={15} />
                                                <span>{selectedLead.whatsapp || selectedLead.phone}</span>
                                            </div>
                                        )}

                                        <div className="sp-contact-actions">
                                            <button
                                                className="sp-contact-action-btn call-action"
                                                onClick={() => callContact(selectedLead.phone)}
                                            >
                                                <Phone size={14} /> Call
                                            </button>
                                            <button
                                                className="sp-contact-action-btn wa-action"
                                                onClick={() => whatsappContact(selectedLead.whatsapp || selectedLead.phone)}
                                            >
                                                <MessageCircle size={14} /> WhatsApp
                                            </button>
                                            <button
                                                className="sp-contact-action-btn email-action"
                                                onClick={() => emailContact(selectedLead.email)}
                                            >
                                                <Mail size={14} /> Email
                                            </button>
                                        </div>
                                    </div>

                                    {/* Notes */}
                                    {selectedLead.notes && (
                                        <div className="sp-detail-section">
                                            <h4>Notes</h4>
                                            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.88rem', lineHeight: 1.5 }}>
                                                {selectedLead.notes}
                                            </p>
                                        </div>
                                    )}

                                    {/* Log Call Button */}
                                    <div className="sp-detail-section">
                                        <button
                                            className="sp-log-call-btn"
                                            onClick={() => openCallLogger(selectedLead)}
                                        >
                                            <PhoneCall size={18} /> Log a Call
                                        </button>
                                    </div>

                                    {/* Call History */}
                                    <div className="sp-detail-section">
                                        <h4>Call History</h4>
                                        <div className="sp-call-history">
                                            {selectedLead.callLog && selectedLead.callLog.length > 0 ? (
                                                [...selectedLead.callLog]
                                                    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
                                                    .map((call, idx) => (
                                                        <div key={idx} className="sp-call-entry">
                                                            <div className={`sp-call-outcome-dot ${call.outcome}`}></div>
                                                            <div className="sp-call-entry-content">
                                                                <div className="sp-call-entry-header">
                                                                    <span className="sp-call-entry-outcome">
                                                                        {call.outcome?.replace('_', ' ')}
                                                                    </span>
                                                                    <span className="sp-call-entry-time">
                                                                        {formatCallTime(call.timestamp)}
                                                                    </span>
                                                                </div>
                                                                {call.notes && (
                                                                    <div className="sp-call-entry-notes">{call.notes}</div>
                                                                )}
                                                                {call.calledByName && (
                                                                    <div className="sp-call-entry-notes" style={{ fontSize: '0.72rem', marginTop: '2px' }}>
                                                                        by {call.calledByName}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    ))
                                            ) : (
                                                <p className="sp-no-calls">No calls logged yet</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div
                                className="sp-no-selection"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                            >
                                <PhoneOff size={48} />
                                <p>Select a lead from the queue to view details</p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </main>

            {/* ===== LOG CALL MODAL ===== */}
            <AnimatePresence>
                {showCallModal && selectedLead && (
                    <motion.div
                        className="sp-modal-overlay"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setShowCallModal(false)}
                    >
                        <motion.div
                            className="sp-modal"
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="sp-modal-header">
                                <h3>📞 Log Call</h3>
                                <button className="sp-modal-close" onClick={() => setShowCallModal(false)}>&times;</button>
                            </div>
                            <div className="sp-modal-body">
                                {/* Lead Info */}
                                <div className="sp-modal-lead-info">
                                    <div className="sp-modal-lead-avatar">
                                        {selectedLead.name?.charAt(0)?.toUpperCase() || '?'}
                                    </div>
                                    <div>
                                        <div className="sp-modal-lead-name">{selectedLead.name}</div>
                                        <div className="sp-modal-lead-phone">{selectedLead.phone || 'No phone'}</div>
                                    </div>
                                </div>

                                {/* Outcome Selection */}
                                <div className="sp-outcome-label">Call Outcome *</div>
                                <div className="sp-outcome-grid">
                                    {outcomes.map(o => (
                                        <button
                                            key={o.key}
                                            className={`sp-outcome-btn ${callOutcome === o.key ? `selected ${o.key}` : ''}`}
                                            onClick={() => setCallOutcome(o.key)}
                                        >
                                            {o.label}
                                        </button>
                                    ))}
                                </div>

                                {/* Notes */}
                                <div className="sp-notes-field">
                                    <label>Notes (Optional)</label>
                                    <textarea
                                        placeholder="Add any notes about the call..."
                                        value={callNotes}
                                        onChange={(e) => setCallNotes(e.target.value)}
                                    />
                                </div>

                                {/* Actions */}
                                <div className="sp-modal-actions">
                                    <button className="sp-modal-btn cancel" onClick={() => setShowCallModal(false)}>
                                        Cancel
                                    </button>
                                    <button
                                        className="sp-modal-btn save"
                                        onClick={saveCallLog}
                                        disabled={!callOutcome || savingCall}
                                    >
                                        {savingCall ? (
                                            <RefreshCw className="spinning" size={16} />
                                        ) : (
                                            <>
                                                <CheckCircle size={16} /> Save Call Log
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default SalesPortal;
