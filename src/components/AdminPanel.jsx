import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';




import { db } from '../firebase';
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf.mjs';
import { getDocs, collection, query, orderBy, onSnapshot, updateDoc, doc, deleteDoc, addDoc, serverTimestamp, writeBatch, where } from 'firebase/firestore';
import {
    Users,
    FileText,
    Download,
    Trash2,
    CheckCircle,
    Clock,
    ExternalLink,
    Mail,
    Phone,
    MessageCircle,
    Briefcase,
    ChevronDown,
    Filter,
    RefreshCw,
    Lock,
    Eye,
    EyeOff,
    UserPlus,
    Upload,
    Search,
    Send,
    Copy,
    Target,
    TrendingUp,
    X,
    AlertCircle,
    Hash,
    UserCheck,
    UserX
} from 'lucide-react';
import './AdminPanel.css';
import { motion, AnimatePresence } from 'framer-motion';

const AdminPanel = () => {
    const navigate = useNavigate();


    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [activeTab, setActiveTab] = useState('applications');
    const [selectedApp, setSelectedApp] = useState(null);

    // Authentication states
    const [isAuthenticated, setIsAuthenticated] = useState(
        () => sessionStorage.getItem('bixsol_admin_auth') === 'true'
    );
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [authenticating, setAuthenticating] = useState(false);

    // ===== SALES LEADS STATES =====
    const [leads, setLeads] = useState([]);
    const [leadsLoading, setLeadsLoading] = useState(true);
    const [selectedLead, setSelectedLead] = useState(null);
    const [selectedLeadIds, setSelectedLeadIds] = useState(new Set());
    const [leadFilter, setLeadFilter] = useState('all');
    const [leadSearch, setLeadSearch] = useState('');
    const [showAddLeadModal, setShowAddLeadModal] = useState(false);
    const [showImportModal, setShowImportModal] = useState(false);
    const [showComposeModal, setShowComposeModal] = useState(false);
    const [showWhatsAppModal, setShowWhatsAppModal] = useState(false);
    const [toast, setToast] = useState(null);

    // Add Lead form
    const [newLead, setNewLead] = useState({
        name: '', email: '', phone: '', whatsapp: '', notes: '', status: 'new'
    });

    // CSV Import
    const [csvData, setCsvData] = useState('');
    const [importTab, setImportTab] = useState('file'); // 'file' or 'paste'
    const [parsedLeads, setParsedLeads] = useState([]);
    const [skipHeader, setSkipHeader] = useState(true);
    const [dragActive, setDragActive] = useState(false);
    const [csvFileName, setCsvFileName] = useState('');
    const fileInputRef = useRef(null);

    // Email compose
    const [emailSubject, setEmailSubject] = useState('');
    const [emailBody, setEmailBody] = useState('');

    // WhatsApp template
    const [waMessage, setWaMessage] = useState('');

    // ===== SALES TEAM STATES =====
    const [salesTeam, setSalesTeam] = useState([]);

// New: fetch all sales team members for admin selection
const [teamMembers, setTeamMembers] = useState([]);
const [teamLoading, setTeamLoading] = useState(true);

// New state for bulk sales team creation modal
const [showBulkAddModal, setShowBulkAddModal] = useState(false);
const [bulkInput, setBulkInput] = useState('');
const [bulkResult, setBulkResult] = useState([]);
const [bulkEntries, setBulkEntries] = useState([]);
const [bulkCsvFileName, setBulkCsvFileName] = useState('');
const bulkFileInputRef = useRef(null);

useEffect(() => {
    const fetchTeamMembers = async () => {
        try {
            const snap = await getDocs(collection(db, 'sales_team'));
            const members = snap.docs.map(d => ({ id: d.id, ...d.data() }));
            setTeamMembers(members);
        } catch (e) {
            console.error('Error fetching sales team members:', e);
        } finally {
            setTeamLoading(false);
        }
    };
    fetchTeamMembers();
}, []);

// Utility to generate a unique 6-digit numeric portal access code
const generateSixDigitPassword = (existingCodes = new Set()) => {
    let code;
    const generateCode = () => {
        const randomValue = window.crypto?.getRandomValues
            ? window.crypto.getRandomValues(new Uint32Array(1))[0] % 1000000
            : Math.floor(Math.random() * 1000000);
        return randomValue.toString().padStart(6, '0');
    };

    do {
        code = generateCode();
    } while (existingCodes.has(code));
    existingCodes.add(code);
    return code;
};


    const [salesTeamLoading, setSalesTeamLoading] = useState(true);
    const [assignedClosers, setAssignedClosers] = useState([]);
    const [assignedLoading, setAssignedLoading] = useState(true);
    const [showAssignCloserModal, setShowAssignCloserModal] = useState(false);
    const [assignTargetMember, setAssignTargetMember] = useState(null);
    // Restored original state for team member management
    const [showAddTeamMemberModal, setShowAddTeamMemberModal] = useState(false);
    const [newTeamMember, setNewTeamMember] = useState({ name: '', phone: '', email: '' });
    const [showAssignModal, setShowAssignModal] = useState(false);
    const [assignTarget, setAssignTarget] = useState('');


    const hashPassword = async (pwd) => {
        const encoder = new TextEncoder();
        const data = encoder.encode(pwd);
        const hashBuffer = await window.crypto.subtle.digest('SHA-256', data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        return hashHex;
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        if (!password.trim()) {
            setError('Please enter a password');
            return;
        }

        setAuthenticating(true);
        setError('');

        try {
            // Subtle transition delay (400ms) for premium feeling
            await new Promise(resolve => setTimeout(resolve, 400));
            const hashed = await hashPassword(password);
            
            // SHA-256 hash of "bixsol@2161"
            if (hashed === 'a0ae62b0f448a4008f42dc7b4f1bd6cc3e38a878a75916a94b985adbb7b91c2f') {
                sessionStorage.setItem('bixsol_admin_auth', 'true');
                setIsAuthenticated(true);
            } else {
                setError('Incorrect password. Access denied.');
                const inputEl = document.querySelector('.login-input');
                if (inputEl) {
                    inputEl.select();
                }
            }
        } catch (err) {
            console.error("Authentication error:", err);
            setError('Authentication failed. Please try again.');
        } finally {
            setAuthenticating(false);
        }
    };

    const handleLogout = () => {
        sessionStorage.removeItem('bixsol_admin_auth');
        setIsAuthenticated(false);
        setPassword('');
        setSelectedApp(null);
        setSelectedLead(null);
    };

    // ===== FIRESTORE: APPLICATIONS =====
    useEffect(() => {
        if (!isAuthenticated) return;

        setLoading(true);
        const q = query(collection(db, 'applications'), orderBy('submittedAt', 'desc'));

        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const apps = [];
            querySnapshot.forEach((doc) => {
                apps.push({ id: doc.id, ...doc.data() });
            });
            setApplications(apps);
            setLoading(false);
        }, (error) => {
            console.error("Error fetching applications:", error);
            showToast("❌ Error loading applications: " + error.message);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [isAuthenticated]);

    // ===== FIRESTORE: SALES LEADS =====
    useEffect(() => {
        if (!isAuthenticated) return;

        setLeadsLoading(true);
        const q = query(collection(db, 'sales_leads'), orderBy('createdAt', 'desc'));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const leadsData = [];
            snapshot.forEach((doc) => {
                leadsData.push({ id: doc.id, ...doc.data() });
            });
            setLeads(leadsData);
            setLeadsLoading(false);
        }, (err) => {
            console.error("Error fetching leads:", err);
            showToast("❌ Error loading leads: " + err.message);
            setLeadsLoading(false);
        });

        return () => unsubscribe();
    }, [isAuthenticated]);

    // ===== FIRESTORE: SALES TEAM =====
    useEffect(() => {
        if (!isAuthenticated) return;

        setSalesTeamLoading(true);
        const q = query(collection(db, 'sales_team'), orderBy('createdAt', 'desc'));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const teamData = [];
            snapshot.forEach((d) => {
                teamData.push({ id: d.id, ...d.data() });
            });
            setSalesTeam(teamData);
            setSalesTeamLoading(false);
        }, (err) => {
            console.error('Error fetching sales team:', err);
            showToast("❌ Error loading sales team: " + err.message);
            setSalesTeamLoading(false);
        });
        
        // Fetch assigned closers
        const fetchAssignedClosers = async () => {
            try {
                const snap = await getDocs(query(collection(db, 'sales_team'), where('assignedCloser', '==', true)));
                const closers = snap.docs.map(d => ({ id: d.id, ...d.data() }));
                setAssignedClosers(closers);
            } catch (e) {
                console.error('Error fetching assigned closers:', e);
            } finally {
                setAssignedLoading(false);
            }
        };
        fetchAssignedClosers();

        return () => unsubscribe();
    }, [isAuthenticated]);

    const handleAssignCloser = async (member) => {
        // Generate random password
        const generatePassword = (length = 8) => {
            const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
            let pwd = '';
            const cryptoObj = window.crypto || window.msCrypto;
            const randomVals = new Uint32Array(length);
            cryptoObj.getRandomValues(randomVals);
            for (let i = 0; i < length; i++) {
                pwd += charset[randomVals[i] % charset.length];
            }
            return pwd;
        };
        const pwd = generatePassword();
        try {
            const memberRef = doc(db, 'sales_team', member.id);
            await updateDoc(memberRef, { assignedCloser: true, closerPassword: pwd });
            // Update local state
            setAssignedClosers(prev => [...prev, { ...member, assignedCloser: true, closerPassword: pwd }]);
            // Optionally remove from regular team list or refresh
        } catch (e) {
            console.error('Failed to assign closer:', e);
        }
        setShowAssignCloserModal(false);
    };

    // ===== TOAST HELPER =====
    const showToast = (message) => {
        setToast(message);
        setTimeout(() => setToast(null), 3000);
    };

    // ===== APPLICATION ACTIONS =====
    const updateStatus = async (id, newStatus) => {
        try {
            await updateDoc(doc(db, 'applications', id), {
                status: newStatus
            });
        } catch (error) {
            console.error("Error updating status:", error);
        }
    };

    const deleteApplication = async (id) => {
        if (window.confirm('Are you sure you want to delete this application?')) {
            try {
                await deleteDoc(doc(db, 'applications', id));
                if (selectedApp?.id === id) setSelectedApp(null);
            } catch (error) {
                console.error("Error deleting application:", error);
            }
        }
    };

    // ===== LEAD ACTIONS =====
    const addLead = async () => {
        if (!newLead.name.trim() || !newLead.phone.trim()) {
            showToast('⚠️ Name and Phone are required');
            return;
        }
        try {
            await addDoc(collection(db, 'sales_leads'), {
                ...newLead,
                whatsapp: newLead.whatsapp || newLead.phone,
                createdAt: serverTimestamp(),
                status: newLead.status || 'new'
            });
            setNewLead({ name: '', email: '', phone: '', whatsapp: '', notes: '', status: 'new' });
            setShowAddLeadModal(false);
            showToast('✅ Lead added successfully');
        } catch (err) {
            console.error("Error adding lead:", err);
            showToast('❌ Failed to add lead');
        }
    };

    // Detect delimiter
    const detectDelimiter = (text) => {
        const lines = text.slice(0, 1000).split('\n');
        let commaCount = 0;
        let semicolonCount = 0;
        let tabCount = 0;
        for (const line of lines) {
            commaCount += (line.match(/,/g) || []).length;
            semicolonCount += (line.match(/;/g) || []).length;
            tabCount += (line.match(/\t/g) || []).length;
        }
        if (tabCount > commaCount && tabCount > semicolonCount) return '\t';
        if (semicolonCount > commaCount && semicolonCount > tabCount) return ';';
        return ',';
    };

    // Standard RFC 4180 CSV parser
    const parseCSV = (text) => {
        if (!text || !text.trim()) return [];
        const delimiter = detectDelimiter(text);
        const lines = [];
        let row = [""];
        let inQuotes = false;

        for (let i = 0; i < text.length; i++) {
            const char = text[i];
            const nextChar = text[i + 1];

            if (char === '"') {
                if (inQuotes && nextChar === '"') {
                    row[row.length - 1] += '"';
                    i++; // Skip next quote
                } else {
                    inQuotes = !inQuotes;
                }
            } else if (char === delimiter && !inQuotes) {
                row.push('');
            } else if ((char === '\r' || char === '\n') && !inQuotes) {
                if (char === '\r' && nextChar === '\n') {
                    i++; // Skip \n
                }
                lines.push(row);
                row = [""];
            } else {
                row[row.length - 1] += char;
            }
        }
        if (row.length > 1 || row[0] !== '') {
            lines.push(row);
        }

        // Filter out completely empty rows
        return lines.map(r => r.map(c => c.trim())).filter(r => r.some(c => c !== ''));
    };

    // Map rows to lead objects based on headers or default order
    const mapRowsToLeads = (rows, hasHeader) => {
        if (rows.length === 0) return [];

        let nameIdx = 0;
        let emailIdx = 1;
        let phoneIdx = 2;
        let whatsappIdx = -1;
        let startIndex = 0;

        const normalizePhone = (value) => {
            if (!value) return '';
            let phone = value.toString().trim();
            if (phone.startsWith('p:')) phone = phone.slice(2).trim();
            return phone;
        };

        if (hasHeader && rows.length > 0) {
            const header = rows[0].map(h => h.toLowerCase());
            startIndex = 1;

            const foundName = header.findIndex(h => h.includes('full_name') || h.includes('name'));
            const foundEmail = header.findIndex(h => h.includes('email') || h.includes('e-mail'));
            const foundPhone = header.findIndex(h => h.includes('phone_number') || h.includes('phone') || h.includes('mobile') || h.includes('tel') || h.includes('contact'));
            const foundWhatsapp = header.findIndex(h => h.includes('whatsapp') || h.includes('whatsapp_number') || h.includes('wa') || h.includes('chat'));

            if (foundName !== -1) nameIdx = foundName;
            if (foundEmail !== -1) emailIdx = foundEmail;
            if (foundPhone !== -1) phoneIdx = foundPhone;
            if (foundWhatsapp !== -1) whatsappIdx = foundWhatsapp;
        }

        const leadsList = [];
        for (let i = startIndex; i < rows.length; i++) {
            const row = rows[i];
            
            const name = (row[nameIdx] || '').trim();
            const email = (row[emailIdx] || '').trim();
            const phone = normalizePhone(row[phoneIdx] || '');
            const whatsappRaw = whatsappIdx !== -1 ? row[whatsappIdx] : '';
            const whatsapp = normalizePhone((whatsappRaw || phone).trim());

            const isValid = !!name;

            leadsList.push({
                name,
                email,
                phone,
                whatsapp,
                status: 'new',
                isValid,
                selected: isValid // pre-select valid leads
            });
        }
        return leadsList;
    };

const parseTeamCsvEntries = (text) => {
    const rows = parseCSV(text);
    if (rows.length === 0) return [];

    const header = rows[0].map(cell => cell.toLowerCase());
    const hasHeader = header.some(cell => cell.includes('name') || cell.includes('email') || cell.includes('phone') || cell.includes('whatsapp') || cell.includes('wa'));
    let nameIdx = 0;
    let emailIdx = 1;
    let phoneIdx = 2;
    let whatsappIdx = -1;
    let startRow = 0;

    if (hasHeader) {
        startRow = 1;
        const findBestIndex = (patterns) => {
            for (const pattern of patterns) {
                const idx = header.findIndex(cell => cell.includes(pattern));
                if (idx !== -1) return idx;
            }
            return -1;
        };

        const foundName = findBestIndex(['full_name', 'name']);
        const foundEmail = findBestIndex(['email', 'e-mail']);
        const foundPhone = findBestIndex(['phone_number', 'phone', 'mobile', 'tel', 'contact']);
        const foundWhatsapp = findBestIndex(['whatsapp_number', 'whatsapp', 'wa', 'chat']);

        if (foundName !== -1) nameIdx = foundName;
        if (foundEmail !== -1) emailIdx = foundEmail;
        if (foundPhone !== -1) phoneIdx = foundPhone;
        if (foundWhatsapp !== -1) whatsappIdx = foundWhatsapp;
    }

    const normalizePhone = (value) => {
        if (!value) return '';
        let phone = value.trim();
        if (phone.startsWith('p:')) phone = phone.slice(2).trim();
        return phone;
    };

    return rows.slice(startRow)
        .map(row => {
            const name = (row[nameIdx] || '').trim();
            const email = (row[emailIdx] || '').trim();
            const phone = normalizePhone(row[phoneIdx] || '');
            const whatsappSource = whatsappIdx !== -1 ? row[whatsappIdx] : '';
            const whatsapp = normalizePhone((whatsappSource || phone).trim());
            return { name, email, phone, whatsapp };
        })
        .filter(entry => entry.name);
};

const handleBulkFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const fileName = file.name.toLowerCase();
    if (!fileName.endsWith('.csv')) {
        showToast('❌ Please upload a valid CSV file');
        return;
    }
    setBulkCsvFileName(file.name);
    const reader = new FileReader();
    reader.onload = async (event) => {
        const text = event.target.result;
        const entries = parseTeamCsvEntries(text);
        if (entries.length === 0) {
            showToast('❌ No valid names found in CSV');
            return;
        }
        setBulkEntries(entries);
        setBulkInput(entries.map(entry => entry.name).join('\n'));
        showToast(`Parsed ${entries.length} sales team rows`);
        await handleBulkCreate(entries);
    };
    reader.readAsText(file);
};

// Unified handler for CSV and PDF file uploads
const handleFileUpload = async (e) => {
  const file = e.target.files[0];
  if (!file) return;
  const fileName = file.name.toLowerCase();
  if (fileName.endsWith('.csv')) {
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target.result;
      const lines = text.split(/\r?\n/).filter(l => l.trim() !== '');
      const names = lines.map(line => {
        const parts = line.split(',');
        return parts[0].trim();
      });
      setBulkInput(names.join('\n'));
      handleBulkCreate(names);
    };
    reader.readAsText(file);
    } else if (fileName.endsWith('.pdf')) {
    // Read PDF as array buffer
    file.arrayBuffer().then(async (buffer) => {
      const loadingTask = pdfjsLib.getDocument({ data: buffer });
      const pdf = await loadingTask.promise;
      let fullText = '';
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const txt = await page.getTextContent();
        const strings = txt.items.map(item => item.str);
        fullText += strings.join(' ') + '\n';
      }
      const lines = fullText.split(/\r?\n/).filter(l => l.trim() !== '');
      const names = lines.map(line => {
        const parts = line.split(',');
        return parts[0].trim();
      });
      setBulkInput(names.join('\n'));
      handleBulkCreate(names);
    });
  }
};

// Modified handleBulkCreate to accept optional entries array (for file upload)
const handleBulkCreate = async (providedEntries) => {
  setLoading(true);
  try {
    // If supplied via CSV, use those entries; otherwise use parsed CSV entries (if any) or manual bulkInput
    const entries = providedEntries || (bulkEntries.length > 0 ? bulkEntries : bulkInput.split(/\r?\n/)
      .map(name => ({ name: name.trim(), email: '', phone: '', whatsapp: '' }))
      .filter(entry => entry.name));
    const existingCodes = new Set(salesTeam.filter(member => member.password).map(member => member.password));
    const created = [];
    for (const entry of entries) {
      const name = entry.name.trim();
      if (!name) continue;
      const password = generateSixDigitPassword(existingCodes);
      try {
        const payload = {
          name,
          password,
          createdAt: serverTimestamp(),
        };
        if (entry.email) payload.email = entry.email;
        if (entry.phone) payload.phone = entry.phone;
        if (entry.whatsapp) payload.whatsapp = entry.whatsapp;
        const docRef = await addDoc(collection(db, 'sales_team'), payload);
        created.push({ name, password, email: entry.email, phone: entry.phone, whatsapp: entry.whatsapp, id: docRef.id, success: true });
      } catch (err) {
        console.error('Bulk creation error for', name, err);
        created.push({ name: entry.name, password, email: entry.email, phone: entry.phone, whatsapp: entry.whatsapp, success: false, error: err.message || 'Failed to save' });
      }
    }
    setBulkResult(created);
    const successCount = created.filter(r => r.success).length;
    const failedCount = created.length - successCount;
    showToast(`✅ Added ${successCount} sales team member${successCount === 1 ? '' : 's'}${failedCount ? `, ${failedCount} failed` : ''}`);
  } catch (err) {
    console.error('Bulk creation error:', err);
    showToast('❌ Error creating sales team members');
  } finally {
    setLoading(false);
    setShowBulkAddModal(false);
    setBulkInput('');
    setBulkEntries([]);
    setBulkCsvFileName('');
    if (bulkFileInputRef.current) bulkFileInputRef.current.value = '';
  }
};


    // File Drag and Drop / Input handlers
    const processFile = (file) => {
        if (!file.name.endsWith('.csv')) {
            showToast('❌ Please upload a valid CSV file');
            return;
        }
        setCsvFileName(file.name);
        const reader = new FileReader();
        reader.onload = (e) => {
            const text = e.target.result;
            const rows = parseCSV(text);
            if (rows.length > 0) {
                const firstRowJoined = rows[0].join(' ').toLowerCase();
                const hasHeaderWords = firstRowJoined.includes('name') || 
                                       firstRowJoined.includes('email') || 
                                       firstRowJoined.includes('phone') || 
                                       firstRowJoined.includes('whatsapp');
                setSkipHeader(hasHeaderWords);
            }
            setCsvData(text);
        };
        reader.readAsText(file);
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            processFile(file);
        }
    };

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            processFile(e.dataTransfer.files[0]);
        }
    };

    // Reset CSV import states when modal is closed
    useEffect(() => {
        if (!showImportModal) {
            setCsvData('');
            setCsvFileName('');
            setParsedLeads([]);
            setSkipHeader(true);
            setImportTab('file');
            setDragActive(false);
        }
    }, [showImportModal]);

    // Live CSV parser reactive to data/header toggle
    useEffect(() => {
        const rows = parseCSV(csvData);
        if (rows.length > 0) {
            const mapped = mapRowsToLeads(rows, skipHeader);
            setParsedLeads(mapped);
        } else {
            setParsedLeads([]);
        }
    }, [csvData, skipHeader]);

    const importCSV = async () => {
        const selectedLeads = parsedLeads.filter(l => l.selected && l.isValid);
        if (selectedLeads.length === 0) return;
        
        let imported = 0;
        let failed = 0;

        const promises = selectedLeads.map(lead => 
            addDoc(collection(db, 'sales_leads'), {
                name: lead.name,
                email: lead.email,
                phone: lead.phone,
                whatsapp: lead.whatsapp || lead.phone,
                notes: '',
                status: 'new',
                createdAt: serverTimestamp()
            })
        );
        
        try {
            const results = await Promise.allSettled(promises);
            results.forEach(res => {
                if (res.status === 'fulfilled') imported++;
                else failed++;
            });
        } catch (err) {
            console.error("Batch import error:", err);
        }

        setShowImportModal(false);
        if (failed > 0) {
            showToast(`✅ Imported ${imported} leads (${failed} failed)`);
        } else {
            showToast(`✅ Imported ${imported} leads successfully`);
        }
    };

    const updateLeadStatus = async (leadId, newStatus) => {
        try {
            await updateDoc(doc(db, 'sales_leads', leadId), { status: newStatus });
            if (selectedLead?.id === leadId) {
                setSelectedLead(prev => ({ ...prev, status: newStatus }));
            }
        } catch (err) {
            console.error("Error updating lead status:", err);
        }
    };

    const deleteLead = async (leadId) => {
        if (!window.confirm('Delete this lead?')) return;
        try {
            await deleteDoc(doc(db, 'sales_leads', leadId));
            if (selectedLead?.id === leadId) setSelectedLead(null);
            setSelectedLeadIds(prev => {
                const next = new Set(prev);
                next.delete(leadId);
                return next;
            });
            showToast('🗑️ Lead deleted');
        } catch (err) {
            console.error("Error deleting lead:", err);
        }
    };

    const bulkDeleteLeads = async () => {
        if (!window.confirm(`Delete ${selectedLeadIds.size} selected leads?`)) return;
        try {
            const batch = writeBatch(db);
            selectedLeadIds.forEach(id => {
                batch.delete(doc(db, 'sales_leads', id));
            });
            await batch.commit();
            setSelectedLeadIds(new Set());
            setSelectedLead(null);
            showToast(`🗑️ Deleted ${selectedLeadIds.size} leads`);
        } catch (err) {
            console.error("Error bulk deleting:", err);
            showToast('❌ Failed to delete leads');
        }
    };

    const bulkUpdateStatus = async (newStatus) => {
        try {
            const batch = writeBatch(db);
            selectedLeadIds.forEach(id => {
                batch.update(doc(db, 'sales_leads', id), { status: newStatus });
            });
            await batch.commit();
            showToast(`✅ Updated ${selectedLeadIds.size} leads to "${newStatus}"`);
            setSelectedLeadIds(new Set());
        } catch (err) {
            console.error("Error bulk updating:", err);
        }
    };

    // ===== SALES TEAM ACTIONS =====
    const addTeamMember = async () => {
        const name = newTeamMember.name.trim();
        if (!name) {
            showToast('⚠️ Name is required');
            return;
        }

        const existingCodes = new Set(salesTeam.filter(member => member.password).map(member => member.password));
        const password = generateSixDigitPassword(existingCodes);

        try {
            await addDoc(collection(db, 'sales_team'), {
                name,
                phone: newTeamMember.phone.trim(),
                email: newTeamMember.email.trim(),
                password,
                isActive: true,
                createdAt: serverTimestamp()
            });
            setNewTeamMember({ name: '', phone: '', email: '' });
            setShowAddTeamMemberModal(false);
            showToast(`✅ Salesperson added with access code ${password}`);
        } catch (err) {
            console.error('Error adding team member:', err);
            showToast('❌ Failed to add team member');
        }
    };

    const toggleTeamMemberActive = async (memberId, currentActive) => {
        try {
            await updateDoc(doc(db, 'sales_team', memberId), { isActive: !currentActive });
            showToast(currentActive ? '⏸️ Member deactivated' : '✅ Member activated');
        } catch (err) {
            console.error('Error toggling member:', err);
        }
    };

    const deleteTeamMember = async (memberId) => {
        if (!window.confirm(`Delete salesperson ${memberId}? This won't remove their assigned leads.`)) return;
        try {
            await deleteDoc(doc(db, 'sales_team', memberId));
            showToast('🗑️ Team member deleted');
        } catch (err) {
            console.error('Error deleting team member:', err);
        }
    };

    const deleteAllTeamMembers = async () => {
        if (!window.confirm('Delete ALL sales team members? This cannot be undone.')) return;
        try {
            const snap = await getDocs(collection(db, 'sales_team'));
            if (snap.empty) {
                showToast('No sales team members to delete');
                return;
            }
            const batch = writeBatch(db);
            snap.forEach((docItem) => {
                batch.delete(doc(db, 'sales_team', docItem.id));
            });
            await batch.commit();
            showToast('🗑️ All sales team members deleted');
        } catch (err) {
            console.error('Error deleting all team members:', err);
            showToast('❌ Failed to delete all team members');
        }
    };

    const assignLeadsToMember = async (memberId) => {
        if (selectedLeadIds.size === 0) {
            showToast('⚠️ Select leads to assign first');
            return;
        }
        try {
            const batch = writeBatch(db);
            selectedLeadIds.forEach(id => {
                batch.update(doc(db, 'sales_leads', id), { assignedTo: memberId });
            });
            await batch.commit();
            showToast(`✅ Assigned ${selectedLeadIds.size} leads to ${memberId}`);
            setSelectedLeadIds(new Set());
            setShowAssignModal(false);
        } catch (err) {
            console.error('Error assigning leads:', err);
            showToast('❌ Failed to assign leads');
        }
    };

    const unassignLeads = async () => {
        if (selectedLeadIds.size === 0) return;
        try {
            const batch = writeBatch(db);
            selectedLeadIds.forEach(id => {
                batch.update(doc(db, 'sales_leads', id), { assignedTo: null });
            });
            await batch.commit();
            showToast(`✅ Unassigned ${selectedLeadIds.size} leads`);
            setSelectedLeadIds(new Set());
        } catch (err) {
            console.error('Error unassigning leads:', err);
        }
    };

    const getAssignedName = (assignedTo) => {
        if (!assignedTo) return null;
        const member = salesTeam.find(m => m.id === assignedTo);
        return member ? member.name : assignedTo;
    };

    // ===== CONTACT HELPERS =====
    const callContact = (phone) => {
        window.open(`tel:${phone}`);
    };

    const emailContact = (email) => {
        window.open(`mailto:${email}`);
    };

    const whatsappContact = (phone, message = '') => {
        const clean = phone.replace(/[^0-9]/g, '');
        const url = message
            ? `https://wa.me/${clean}?text=${encodeURIComponent(message)}`
            : `https://wa.me/${clean}`;
        window.open(url, '_blank');
    };

    const openBulkEmail = () => {
        const selected = leads.filter(l => selectedLeadIds.has(l.id) && l.email);
        if (selected.length === 0) {
            showToast('⚠️ No emails found for selected leads');
            return;
        }
        setShowComposeModal(true);
    };

    const sendBulkEmail = () => {
        const selected = leads.filter(l => selectedLeadIds.has(l.id) && l.email);
        const emails = selected.map(l => l.email).join(',');
        const mailto = `mailto:?bcc=${emails}&subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
        window.open(mailto);
        setShowComposeModal(false);
        setEmailSubject('');
        setEmailBody('');
        showToast(`📧 Opening email for ${selected.length} recipients`);
    };

    const sendPdfBulkEmail = () => {
      const selected = leads.filter(l => selectedLeadIds.has(l.id) && l.email);
      if (selected.length === 0) {
        showToast('⚠️ No emails found for selected leads');
        return;
      }
      const emails = selected.map(l => l.email).join(',');
      const pdfUrl = `${window.location.origin}/assets/sales%20closer%20pdf/sales%20closer%20leads%20-%20Sheet1%20(1).pdf`;
      const subject = encodeURIComponent(emailSubject || 'Sales Closer Leads PDF');
      const body = encodeURIComponent(`${emailBody}\n\nPlease find the Sales Closer Leads PDF here: ${pdfUrl}`);
      const mailto = `mailto:?bcc=${emails}&subject=${subject}&body=${body}`;
      window.open(mailto);
      setShowComposeModal(false);
      setEmailSubject('');
      setEmailBody('');
      showToast(`📧 Opening email for ${selected.length} recipients with PDF link`);
    };

    const copyEmails = () => {
        const selected = leads.filter(l => selectedLeadIds.has(l.id) && l.email);
        const emails = selected.map(l => l.email).join(', ');
        navigator.clipboard.writeText(emails);
        showToast(`📋 Copied ${selected.length} emails to clipboard`);
    };

    const openBulkWhatsApp = () => {
        const selected = leads.filter(l => selectedLeadIds.has(l.id) && (l.whatsapp || l.phone));
        if (selected.length === 0) {
            showToast('⚠️ No WhatsApp numbers found');
            return;
        }
        setShowWhatsAppModal(true);
    };

    const sendBulkWhatsApp = () => {
        const selected = leads.filter(l => selectedLeadIds.has(l.id) && (l.whatsapp || l.phone));
        selected.forEach((lead, i) => {
            setTimeout(() => {
                whatsappContact(lead.whatsapp || lead.phone, waMessage);
            }, i * 1500);
        });
        setShowWhatsAppModal(false);
        setWaMessage('');
        showToast(`💬 Opening WhatsApp for ${selected.length} contacts`);
    };

    // ===== TOGGLE HELPERS =====
    const toggleLeadSelection = (id) => {
        setSelectedLeadIds(prev => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    };

    const toggleSelectAll = () => {
        if (selectedLeadIds.size === filteredLeads.length) {
            setSelectedLeadIds(new Set());
        } else {
            setSelectedLeadIds(new Set(filteredLeads.map(l => l.id)));
        }
    };

    // ===== FILTERED & COMPUTED =====
    const filteredApplications = applications.filter(app =>
        filter === 'all' ? true : app.status === filter
    );

    const filteredLeads = useMemo(() => {
        return leads.filter(lead => {
            const matchesFilter = leadFilter === 'all' || lead.status === leadFilter;
            const matchesSearch = !leadSearch || 
                lead.name?.toLowerCase().includes(leadSearch.toLowerCase()) ||
                lead.email?.toLowerCase().includes(leadSearch.toLowerCase()) ||
                lead.phone?.includes(leadSearch) ||
                lead.whatsapp?.includes(leadSearch);
            return matchesFilter && matchesSearch;
        });
    }, [leads, leadFilter, leadSearch]);

    const stats = {
        total: applications.length,
        pending: applications.filter(a => a.status === 'pending').length,
        reviewed: applications.filter(a => a.status === 'reviewed').length,
        shortlisted: applications.filter(a => a.status === 'shortlisted').length
    };

    const handleSelectSalesperson = async (member) => {
        // Generate a simple random password for the salesperson
        const generatePassword = (length = 8) => {
            const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
            let pwd = '';
            const cryptoObj = window.crypto || window.msCrypto;
            const randomVals = new Uint32Array(length);
            cryptoObj.getRandomValues(randomVals);
            for (let i = 0; i < length; i++) {
                pwd += charset[randomVals[i] % charset.length];
            }
            return pwd;
        };
        const pwd = generatePassword();
        // Store selected salesperson info and generated password in sessionStorage for SalesPortal access
        sessionStorage.setItem('bixsol_sp_id', member.id);
        sessionStorage.setItem('bixsol_sp_name', member.name);
        sessionStorage.setItem('bixsol_sp_pwd', pwd);
        // Update the salesperson document with the generated password
        try {
            const memberRef = doc(db, 'sales_team', member.id);
            await updateDoc(memberRef, { password: pwd });
        } catch (e) {
            console.error('Failed to save password for salesperson', e);
        }
        setIsAuthenticated(true);
        // Optionally redirect to SalesPortal
        navigate('/portal');
    };

    const leadStats = {
        total: leads.length,
        new: leads.filter(l => l.status === 'new').length,
        contacted: leads.filter(l => l.status === 'contacted').length,
        converted: leads.filter(l => l.status === 'converted').length
    };



    // ===== LOGIN SCREEN =====
    if (!isAuthenticated) {
        return (
            <div className="admin-login-container">
                <motion.div 
                    className="login-card glass"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                >
                    <div className="login-logo-area">
                        <div className="lock-icon-wrap">
                            <Lock className="lock-icon" size={32} />
                        </div>
                        <h2>Admin <span className="gradient-text">Portal</span></h2>
                        <p>Authenticate to access candidate applications</p>
                    </div>

                    <form onSubmit={handleLogin} className="login-form">
                        <div className="input-group-sec">
                            <label htmlFor="admin-pwd">Enter Access Password</label>
                            <div className="input-field-wrapper">
                                <input
                                    id="admin-pwd"
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••••••"
                                    className="login-input"
                                    disabled={authenticating}
                                    autoFocus
                                />
                                <button
                                    type="button"
                                    className="pwd-toggle"
                                    onClick={() => setShowPassword(!showPassword)}
                                    title={showPassword ? "Hide password" : "Show password"}
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        {error && (
                            <motion.div 
                                className="login-error-msg"
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                            >
                                {error}
                            </motion.div>
                        )}

                        <button 
                            type="submit" 
                            className="login-submit-btn"
                            disabled={authenticating}
                        >
                            {authenticating ? (
                                <RefreshCw className="spinning" size={18} />
                            ) : (
                                "Unlock Panel"
                            )}
                        </button>
                    </form>
                </motion.div>
            </div>
        );
    }

    // ===== LOADING SCREEN =====
    if (loading && leadsLoading) {
        return (
            <div className="admin-loading">
                <RefreshCw className="spinning" size={40} />
                <p>Loading Admin Panel...</p>
            </div>
        );
    }

    // ===== MAIN PANEL =====
    return (
        <div className="admin-container">
            {/* Toast Notification */}
            <AnimatePresence>
                {toast && (
                    <motion.div 
                        className="toast-notification"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                    >
                        {toast}
                    </motion.div>
                )}
            </AnimatePresence>

            <header className="admin-header">
                <div className="admin-title-area">
                    <h1>Admin <span className="gradient-text">Panel</span></h1>
                    <p>Manage applications, resumes & sales leads</p>
                </div>

                <div className="admin-header-right">
                    <button onClick={handleLogout} className="logout-btn glass">
                        Lock Panel
                    </button>
                    
                    <div className="admin-stats-grid">
                        <div className="stat-card glass">
                            <Users className="stat-icon" />
                            <div className="stat-info">
                                <span className="stat-label">Applicants</span>
                                <span className="stat-value">{stats.total}</span>
                            </div>
                        </div>
                        <div className="stat-card glass">
                            <Clock className="stat-icon pending" />
                            <div className="stat-info">
                                <span className="stat-label">Pending</span>
                                <span className="stat-value">{stats.pending}</span>
                            </div>
                        </div>
                        <div className="stat-card glass">
                            <Target className="stat-icon success" />
                            <div className="stat-info">
                                <span className="stat-label">Leads</span>
                                <span className="stat-value">{leadStats.total}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            <main className="admin-content">
                {/* ===== TABS ===== */}
                <div className="admin-tabs">
                    <button 
                        className={`tab-btn ${activeTab === 'applications' ? 'active' : ''}`}
                        onClick={() => setActiveTab('applications')}
                    >
                        Applications
                        <span className="tab-badge">{applications.length}</span>
                    </button>
                    <button 
                        className={`tab-btn ${activeTab === 'resumes' ? 'active' : ''}`}
                        onClick={() => setActiveTab('resumes')}
                    >
                        Resumes
                        <span className="tab-badge">{applications.filter(a => a.resumeFileName && a.resumeFileName !== 'No file uploaded').length}</span>
                    </button>
                    <button 
                        className={`tab-btn ${activeTab === 'leads' ? 'active' : ''}`}
                        onClick={() => setActiveTab('leads')}
                    >
                        Sales Leads
                        <span className="tab-badge">{leads.length}</span>
                    </button>
                    <button 
                          className={`tab-btn ${activeTab === 'salescloser' ? 'active' : ''}`}
                          onClick={() => setActiveTab('salescloser')}
                        >
                          Sales Closer
                          <span className="tab-badge">PDF</span>
                    </button>
                    <button 
                        className={`tab-btn ${activeTab === 'salesteam' ? 'active' : ''}`}
                        onClick={() => setActiveTab('salesteam')}
                    >
                        Sales Team
                        <span className="tab-badge">{salesTeam.length}</span>
                    </button>
                    <button 
                        className={`tab-btn ${activeTab === 'assignedclosers' ? 'active' : ''}`}
                        onClick={() => setActiveTab('assignedclosers')}
                    >
                        Assigned Closers
                    </button>
                </div>

                {/* ===== APPLICATIONS TAB ===== */}
                {activeTab === 'applications' && (
                <>
                <div className="admin-controls">
                    <div className="filter-group glass">
                        <Filter size={18} />
                        <select value={filter} onChange={(e) => setFilter(e.target.value)}>
                            <option value="all">All Applications</option>
                            <option value="pending">Pending</option>
                            <option value="reviewed">Reviewed</option>
                            <option value="shortlisted">Shortlisted</option>
                            <option value="rejected">Rejected</option>
                        </select>
                    </div>
                </div>

                <div className="admin-dashboard-grid">
                    <div className="applications-list-container glass">
                        <div className="list-header">
                            <span>Candidate</span>
                            <span>Position</span>
                            <span>Date</span>
                            <span>Status</span>
                            <span>Actions</span>
                        </div>
                        <div className="list-body">
                            {filteredApplications.length === 0 ? (
                                <div className="no-data">No applications found.</div>
                            ) : (
                                filteredApplications.map(app => (
                                    <motion.div
                                        key={app.id}
                                        className={`list-item ${selectedApp?.id === app.id ? 'active' : ''}`}
                                        onClick={() => setSelectedApp(app)}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                    >
                                        <div className="candidate-info">
                                            <div className="avatar">{app.name.charAt(0)}</div>
                                            <div className="name-email">
                                                <span className="name">{app.name}</span>
                                                <span className="email">{app.email}</span>
                                            </div>
                                        </div>
                                        <div className="position">
                                            <Briefcase size={14} />
                                            {app.position}
                                        </div>
                                        <div className="date">
                                            {app.submittedAt?.toDate().toLocaleDateString()}
                                        </div>
                                        <div className={`status-badge ${app.status}`}>
                                            {app.status}
                                        </div>
                                        <div className="actions" onClick={e => e.stopPropagation()}>
                                            <a href={app.resumeData} download={app.fileName || 'resume'} title="Download CV">
                                                <Download size={18} />
                                            </a>
                                            <button onClick={() => deleteApplication(app.id)} title="Delete">
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </motion.div>
                                ))
                            )}
                        </div>
                    </div>

                    <AnimatePresence>
                        {selectedApp && (
                            <motion.div
                                className="application-details glass"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                            >
                                <div className="details-header">
                                    <h3>Application Details</h3>
                                    <button className="close-btn" onClick={() => setSelectedApp(null)}>&times;</button>
                                </div>

                                <div className="details-body">
                                    <div className="detail-section">
                                        <div className="applicant-profile">
                                            <div className="large-avatar">{selectedApp.name.charAt(0)}</div>
                                            <h2>{selectedApp.name}</h2>
                                            <span className="position-tag">{selectedApp.position}</span>
                                        </div>
                                    </div>

                                    <div className="detail-section">
                                        <h4>Contact Information</h4>
                                        <div className="info-row">
                                            <Mail size={16} />
                                            <span>{selectedApp.email}</span>
                                        </div>
                                        <div className="info-row">
                                            <Phone size={16} />
                                            <span>{selectedApp.phone}</span>
                                        </div>
                                        <div style={{ display: 'flex', gap: '10px', marginTop: '12px' }}>
                                            <button
                                                onClick={() => window.open(`tel:${selectedApp.phone}`)}
                                                title="Call"
                                                style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '6px',
                                                    padding: '8px 16px',
                                                    backgroundColor: '#4CAF50',
                                                    color: 'white',
                                                    border: 'none',
                                                    borderRadius: '6px',
                                                    cursor: 'pointer',
                                                    fontSize: '0.9em',
                                                    fontWeight: '500',
                                                    transition: 'background 0.3s'
                                                }}
                                                onMouseOver={(e) => e.target.style.backgroundColor = '#45a049'}
                                                onMouseOut={(e) => e.target.style.backgroundColor = '#4CAF50'}
                                            >
                                                <Phone size={16} />
                                                Call
                                            </button>
                                            <button
                                                onClick={() => {
                                                    const whatsappNumber = selectedApp.whatsappNumber || selectedApp.phone;
                                                    window.open(`https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}`, '_blank');
                                                }}
                                                title="WhatsApp"
                                                style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '6px',
                                                    padding: '8px 16px',
                                                    backgroundColor: '#25D366',
                                                    color: 'white',
                                                    border: 'none',
                                                    borderRadius: '6px',
                                                    cursor: 'pointer',
                                                    fontSize: '0.9em',
                                                    fontWeight: '500',
                                                    transition: 'background 0.3s'
                                                }}
                                                onMouseOver={(e) => e.target.style.backgroundColor = '#1fa857'}
                                                onMouseOut={(e) => e.target.style.backgroundColor = '#25D366'}
                                            >
                                                <MessageCircle size={16} />
                                                WhatsApp
                                            </button>
                                        </div>
                                    </div>

                                    <div className="detail-section">
                                        <h4>Cover Letter</h4>
                                        <div className="cover-letter-box">
                                            {selectedApp.coverLetter || "No cover letter provided."}
                                        </div>
                                    </div>

                                    <div className="detail-section">
                                        <h4>Resume</h4>
                                        <div className="resume-info">
                                            {selectedApp.resumeFileName ? (
                                                <div className="resume-file-info">
                                                    <FileText size={24} />
                                                    <div>
                                                        <p className="resume-filename">{selectedApp.resumeFileName}</p>
                                                        <p className="resume-note">File received and stored</p>
                                                    </div>
                                                </div>
                                            ) : (
                                                <p className="no-resume">No resume uploaded</p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="detail-section">
                                        <h4>Manage Status</h4>
                                        <div className="status-buttons">
                                            <button
                                                className={`status-btn pending ${selectedApp.status === 'pending' ? 'active' : ''}`}
                                                onClick={() => updateStatus(selectedApp.id, 'pending')}
                                            >Pending</button>
                                            <button
                                                className={`status-btn reviewed ${selectedApp.status === 'reviewed' ? 'active' : ''}`}
                                                onClick={() => updateStatus(selectedApp.id, 'reviewed')}
                                            >Reviewed</button>
                                            <button
                                                className={`status-btn shortlisted ${selectedApp.status === 'shortlisted' ? 'active' : ''}`}
                                                onClick={() => updateStatus(selectedApp.id, 'shortlisted')}
                                            >Shortlisted</button>
                                            <button
                                                className={`status-btn rejected ${selectedApp.status === 'rejected' ? 'active' : ''}`}
                                                onClick={() => updateStatus(selectedApp.id, 'rejected')}
                                            >Rejected</button>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
                </>
                )}

                {/* ===== RESUMES TAB ===== */}
                {activeTab === 'resumes' && (
                    <div className="applications-list-container glass">
                        <div className="list-header">
                            <span>Candidate</span>
                            <span>Position</span>
                            <span>Date</span>
                            <span>Status</span>
                            <span>Actions</span>
                        </div>
                        <div className="list-body">
                            {applications.filter(a => a.resumeFileName && a.resumeFileName !== 'No file uploaded').length === 0 ? (
                                <div className="no-data">No resumes found.</div>
                            ) : (
                                applications.filter(a => a.resumeFileName && a.resumeFileName !== 'No file uploaded').map(app => (
                                    <motion.div
                                        key={app.id}
                                        className="list-item"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                    >
                                        <div className="candidate-info">
                                            <div className="avatar">{app.name.charAt(0)}</div>
                                            <div className="name-email">
                                                <span className="name">{app.name}</span>
                                                <span className="email">{app.resumeFileName}</span>
                                            </div>
                                        </div>
                                        <div className="position">
                                            <Briefcase size={14} />
                                            {app.position}
                                        </div>
                                        <div className="date">
                                            {app.submittedAt?.toDate().toLocaleDateString()}
                                        </div>
                                        <div className={`status-badge ${app.status}`}>
                                            {app.status}
                                        </div>
                                        <div className="actions">
                                            <a href={app.resumeData} download={app.resumeFileName || 'resume'} title="Download Resume">
                                                <Download size={18} />
                                            </a>
                                        </div>
                                    </motion.div>
                                ))
                            )}
                        </div>
                    </div>
                )}

                {/* ===== SALES LEADS TAB ===== */}
                {activeTab === 'leads' && (
                    <div className="leads-section">
                        {/* Lead Stats */}
                        <div className="leads-stats-row">
                            <div className="lead-stat-card">
                                <div className="lead-stat-icon total"><Users size={22} /></div>
                                <div className="lead-stat-info">
                                    <span className="lead-stat-label">Total Leads</span>
                                    <span className="lead-stat-value">{leadStats.total}</span>
                                </div>
                            </div>
                            <div className="lead-stat-card">
                                <div className="lead-stat-icon new"><UserPlus size={22} /></div>
                                <div className="lead-stat-info">
                                    <span className="lead-stat-label">New</span>
                                    <span className="lead-stat-value">{leadStats.new}</span>
                                </div>
                            </div>
                            <div className="lead-stat-card">
                                <div className="lead-stat-icon contacted"><Phone size={22} /></div>
                                <div className="lead-stat-info">
                                    <span className="lead-stat-label">Contacted</span>
                                    <span className="lead-stat-value">{leadStats.contacted}</span>
                                </div>
                            </div>
                            <div className="lead-stat-card">
                                <div className="lead-stat-icon converted"><TrendingUp size={22} /></div>
                                <div className="lead-stat-info">
                                    <span className="lead-stat-label">Converted</span>
                                    <span className="lead-stat-value">{leadStats.converted}</span>
                                </div>
                            </div>
                        </div>

                        {/* Toolbar */}
                        <div className="leads-toolbar">
                            <div className="leads-toolbar-left">
                                <button className="toolbar-btn primary" onClick={() => setShowAddLeadModal(true)}>
                                    <UserPlus size={16} /> Add Lead
                                </button>
                                <button className="toolbar-btn" onClick={() => setShowImportModal(true)}>
                                    <Upload size={16} /> Import CSV
                                </button>
                            </div>
                            <div className="leads-toolbar-right">
                                <div className="search-wrapper">
                                    <Search size={16} />
                                    <input
                                        type="text"
                                        className="leads-search-input"
                                        placeholder="Search leads..."
                                        value={leadSearch}
                                        onChange={(e) => setLeadSearch(e.target.value)}
                                    />
                                </div>
                                <select 
                                    className="leads-filter-select"
                                    value={leadFilter}
                                    onChange={(e) => setLeadFilter(e.target.value)}
                                >
                                    <option value="all">All Status</option>
                                    <option value="new">New</option>
                                    <option value="contacted">Contacted</option>
                                    <option value="interested">Interested</option>
                                    <option value="converted">Converted</option>
                                    <option value="not_interested">Not Interested</option>
                                </select>
                            </div>
                        </div>

                        {/* Bulk Action Bar */}
                        {selectedLeadIds.size > 0 && (
                            <div className="bulk-action-bar">
                                <span className="bulk-count">{selectedLeadIds.size} selected</span>
                                <button className="bulk-btn assign" onClick={() => setShowAssignModal(true)}>
                                    <UserCheck size={14} /> Assign
                                </button>
                                <button className="bulk-btn unassign" onClick={unassignLeads}>
                                    <UserX size={14} /> Unassign
                                </button>
                                <button className="bulk-btn email" onClick={openBulkEmail}>
                                    <Mail size={14} /> Email All
                                </button>
                                <button className="bulk-btn whatsapp" onClick={openBulkWhatsApp}>
                                    <MessageCircle size={14} /> WhatsApp All
                                </button>
                                <button className="bulk-btn status" onClick={() => {
                                    const status = prompt('Enter new status (new, contacted, interested, converted, not_interested):');
                                    if (status && ['new', 'contacted', 'interested', 'converted', 'not_interested'].includes(status)) {
                                        bulkUpdateStatus(status);
                                    }
                                }}>
                                    <RefreshCw size={14} /> Update Status
                                </button>
                                <button className="bulk-btn delete" onClick={bulkDeleteLeads}>
                                    <Trash2 size={14} /> Delete
                                </button>
                            </div>
                        )}

                        {/* Leads Table + Detail Grid */}
                        <div className="leads-dashboard-grid">
                            <div className="leads-table-container">
                                <div className="leads-table-header">
                                    <input 
                                        type="checkbox" 
                                        className="lead-checkbox"
                                        checked={filteredLeads.length > 0 && selectedLeadIds.size === filteredLeads.length}
                                        onChange={toggleSelectAll}
                                    />
                                    <span>Name</span>
                                    <span>Email</span>
                                    <span>Phone</span>
                                    <span>Assign</span>
                                    <span>Status</span>
                                    <span>Actions</span>
                                </div>
                                <div className="leads-table-body">
                                    {leadsLoading ? (
                                        <div className="no-data">
                                            <RefreshCw className="spinning" size={24} />
                                            <p style={{ marginTop: '0.5rem' }}>Loading leads...</p>
                                        </div>
                                    ) : filteredLeads.length === 0 ? (
                                        <div className="no-data">
                                            {leads.length === 0 
                                                ? 'No leads yet. Add your first lead or import from CSV.'
                                                : 'No leads match your search/filter.'
                                            }
                                        </div>
                                    ) : (
                                        filteredLeads.map(lead => (
                                            <div
                                                key={lead.id}
                                                className={`lead-row ${selectedLeadIds.has(lead.id) ? 'selected' : ''} ${selectedLead?.id === lead.id ? 'active-lead' : ''}`}
                                                onClick={() => setSelectedLead(lead)}
                                            >
                                                <input
                                                    type="checkbox"
                                                    className="lead-checkbox"
                                                    checked={selectedLeadIds.has(lead.id)}
                                                    onChange={(e) => {
                                                        e.stopPropagation();
                                                        toggleLeadSelection(lead.id);
                                                    }}
                                                    onClick={(e) => e.stopPropagation()}
                                                />
                                                <div className="lead-name-cell">
                                                    <div className="lead-avatar">{lead.name?.charAt(0)?.toUpperCase() || '?'}</div>
                                                    <span className="lead-name">{lead.name}</span>
                                                </div>
                                                <span className="lead-email-cell">{lead.email || '—'}</span>
                                                <span className="lead-phone-cell">{lead.phone || '—'}</span>
                                                <span className="lead-assigned-cell">
                                                    {lead.assignedTo ? (
                                                        <span className="assigned-badge">{getAssignedName(lead.assignedTo)}</span>
                                                    ) : (
                                                        <button className="assign-btn" onClick={(e) => {
                                                            e.stopPropagation();
                                                            setAssignTargetMember(lead.id);
                                                            setShowAssignCloserModal(true);
                                                        }}>Assign</button>
                                                    )}
                                                </span>
                                                <div className={`lead-status ${lead.status}`}>
                                                    {lead.status?.replace('_', ' ')}
                                                </div>
                                                <div className="lead-quick-actions" onClick={(e) => e.stopPropagation()}>
                                                    <button 
                                                        className="quick-action-btn call" 
                                                        onClick={() => callContact(lead.phone)}
                                                        title="Call"
                                                    >
                                                        <Phone size={14} />
                                                    </button>
                                                    <button 
                                                        className="quick-action-btn email-action" 
                                                        onClick={() => emailContact(lead.email)}
                                                        title="Email"
                                                    >
                                                        <Mail size={14} />
                                                    </button>
                                                    <button 
                                                        className="quick-action-btn wa" 
                                                        onClick={() => whatsappContact(lead.whatsapp || lead.phone)}
                                                        title="WhatsApp"
                                                    >
                                                        <MessageCircle size={14} />
                                                    </button>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>

                            {/* Lead Detail Panel */}
                            <AnimatePresence>
                                {selectedLead && (
                                    <motion.div
                                        className="lead-detail-panel"
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: 20 }}
                                    >
                                        <div className="lead-detail-header">
                                            <h3>Lead Details</h3>
                                            <button className="modal-close" onClick={() => setSelectedLead(null)}>&times;</button>
                                        </div>

                                        <div className="lead-detail-profile">
                                            <div className="lead-detail-avatar">
                                                {selectedLead.name?.charAt(0)?.toUpperCase() || '?'}
                                            </div>
                                            <div className="lead-detail-name">{selectedLead.name}</div>
                                            <div className={`lead-status ${selectedLead.status}`} style={{ margin: '0.5rem auto 0', display: 'inline-block' }}>
                                                {selectedLead.status?.replace('_', ' ')}
                                            </div>
                                        </div>

                                        <div className="lead-detail-section">
                                            <h4>Contact Information</h4>
                                            {selectedLead.email && (
                                                <div className="lead-contact-row">
                                                    <Mail size={16} />
                                                    <span>{selectedLead.email}</span>
                                                </div>
                                            )}
                                            <div className="lead-contact-row">
                                                <Phone size={16} />
                                                <span>{selectedLead.phone || '—'}</span>
                                            </div>
                                            <div className="lead-contact-row">
                                                <MessageCircle size={16} />
                                                <span>{selectedLead.whatsapp || selectedLead.phone || '—'}</span>
                                            </div>

                                            <div className="lead-action-buttons">
                                                <button 
                                                    className="lead-action-btn call-btn"
                                                    onClick={() => callContact(selectedLead.phone)}
                                                >
                                                    <Phone size={15} /> Call
                                                </button>
                                                <button 
                                                    className="lead-action-btn email-btn"
                                                    onClick={() => emailContact(selectedLead.email)}
                                                >
                                                    <Mail size={15} /> Email
                                                </button>
                                                <button 
                                                    className="lead-action-btn wa-btn"
                                                    onClick={() => whatsappContact(selectedLead.whatsapp || selectedLead.phone)}
                                                >
                                                    <MessageCircle size={15} /> WhatsApp
                                                </button>
                                            </div>
                                        </div>

                                        <div className="lead-detail-section">
                                            <h4>Notes</h4>
                                            <div className={`lead-notes-box ${!selectedLead.notes ? 'empty' : ''}`}>
                                                {selectedLead.notes || 'No notes added'}
                                            </div>
                                        </div>

                                        <div className="lead-detail-section">
                                            <h4>Update Status</h4>
                                            <div className="lead-status-buttons">
                                                {['new', 'contacted', 'interested', 'converted', 'not_interested'].map(s => (
                                                    <button
                                                        key={s}
                                                        className={`lead-status-btn ${s.replace('_', '-')}-status ${selectedLead.status === s ? 'active' : ''}`}
                                                        onClick={() => updateLeadStatus(selectedLead.id, s)}
                                                    >
                                                        {s.replace('_', ' ')}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Call History */}
                                        <div className="lead-detail-section">
                                            <h4>Call History</h4>
                                            <div className="admin-call-history" style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', marginTop: '0.5rem', maxHeight: '200px', overflowY: 'auto' }}>
                                                {selectedLead.callLog && selectedLead.callLog.length > 0 ? (
                                                    [...selectedLead.callLog]
                                                        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
                                                        .map((call, idx) => (
                                                            <div key={idx} className="admin-call-entry" style={{ padding: '0.6rem', background: 'rgba(255,255,255,0.03)', borderRadius: '6px', borderLeft: '3px solid var(--accent-color, #7c3aed)' }}>
                                                                <div className="admin-call-header" style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: '0.2rem' }}>
                                                                    <span style={{ fontWeight: '600', textTransform: 'capitalize' }}>
                                                                        {call.outcome?.replace('_', ' ')}
                                                                    </span>
                                                                    <span style={{ color: 'rgba(255,255,255,0.45)' }}>
                                                                        {new Date(call.timestamp).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })} {new Date(call.timestamp).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                                                                    </span>
                                                                </div>
                                                                {call.notes && (
                                                                    <div className="admin-call-notes" style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.7)', fontStyle: 'italic' }}>
                                                                        "{call.notes}"
                                                                    </div>
                                                                )}
                                                                <div className="admin-call-by" style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.3)', marginTop: '2px' }}>
                                                                    by {call.calledByName || call.calledBy}
                                                                </div>
                                                            </div>
                                                        ))
                                                ) : (
                                                    <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.82rem', fontStyle: 'italic' }}>No calls logged yet</p>
                                                )}
                                            </div>
                                        </div>

                                        <div className="lead-detail-section">
                                            <button 
                                                className="lead-delete-btn"
                                                onClick={() => deleteLead(selectedLead.id)}
                                            >
                                                <Trash2 size={14} /> Delete Lead
                                            </button>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                )}

                {/* ===== SALES TEAM TAB ===== */}
                {activeTab === 'salesteam' && (
                    <div className="leads-section">
                        <div className="leads-stats-row">
                            <div className="lead-stat-card">
                                <div className="lead-stat-icon total"><Users size={22} /></div>
                                <div className="lead-stat-info">
                                    <span className="lead-stat-label">Total Members</span>
                                    <span className="lead-stat-value">{salesTeam.length}</span>
                                </div>
                            </div>
                            <div className="lead-stat-card">
                                <div className="lead-stat-icon new"><UserCheck size={22} /></div>
                                <div className="lead-stat-info">
                                    <span className="lead-stat-label">Active</span>
                                    <span className="lead-stat-value">{salesTeam.filter(m => m.isActive !== false).length}</span>
                                </div>
                            </div>
                            <div className="lead-stat-card">
                                <div className="lead-stat-icon contacted"><Target size={22} /></div>
                                <div className="lead-stat-info">
                                    <span className="lead-stat-label">Leads Assigned</span>
                                    <span className="lead-stat-value">{leads.filter(l => l.assignedTo).length}</span>
                                </div>
                            </div>
                            <div className="lead-stat-card">
                                <div className="lead-stat-icon converted"><TrendingUp size={22} /></div>
                                <div className="lead-stat-info">
                                    <span className="lead-stat-label">Unassigned</span>
                                    <span className="lead-stat-value">{leads.filter(l => !l.assignedTo).length}</span>
                                </div>
                            </div>
                        </div>

                        <div className="leads-toolbar">
                            <div className="leads-toolbar-left">
                                <button className="toolbar-btn primary" onClick={() => setShowAddTeamMemberModal(true)}>
    <UserPlus size={16} /> Add Salesperson
</button>
<button className="toolbar-btn secondary" onClick={() => setShowBulkAddModal(true)} style={{ marginLeft: '0.5rem' }}>
    <UserCheck size={16} /> Bulk Add Sales Team
</button>
<button className="toolbar-btn" onClick={deleteAllTeamMembers} style={{ marginLeft: '0.5rem', borderColor: '#ef4444', color: '#ef4444' }}>
    <Trash2 size={16} /> Delete All Team
</button>
                            </div>
                            <div className="leads-toolbar-right">
                                <span style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.85rem' }}>
                                    Portal URL: <strong style={{ color: '#a78bfa' }}>/portal</strong>
                                </span>
                            </div>
                        </div>

                        {/* Team Members Table */}
                        <div className="leads-table-container">
                            <div className="leads-table-header" style={{ gridTemplateColumns: '40px 1fr 1fr 1fr 100px 120px' }}>
                                <span></span>
                                <span>Access Code</span>
                                <span>Name</span>
                                <span>Contact</span>
                                <span>Status</span>
                                <span>Actions</span>
                            </div>
                            <div className="leads-table-body">
                                {salesTeamLoading ? (
                                    <div className="no-data">
                                        <RefreshCw className="spinning" size={24} />
                                        <p style={{ marginTop: '0.5rem' }}>Loading team...</p>
                                    </div>
                                ) : salesTeam.length === 0 ? (
                                    <div className="no-data">
                                        No team members yet. Add your first salesperson to get started.
                                    </div>
                                ) : (
                                    salesTeam.map(member => (
                                        <div
                                            key={member.id}
                                            className="lead-row"
                                            style={{ gridTemplateColumns: '40px 1fr 1fr 1fr 100px 120px', opacity: member.isActive === false ? 0.5 : 1 }}
                                        >
                                            <div></div>
                                            <div className="lead-name-cell">
                                                <div className="lead-avatar" style={{ background: member.isActive === false ? '#374151' : 'linear-gradient(135deg, #10b981, #059669)' }}>
                                                    {member.name?.charAt(0)?.toUpperCase() || '?'}
                                                </div>
                                                <span className="lead-name" style={{ fontFamily: 'monospace', letterSpacing: '0.05em' }}>{member.password || '------'}</span>
                                            </div>
                                            <span className="lead-email-cell" style={{ fontWeight: 600 }}>{member.name}</span>
                                            <span className="lead-phone-cell">
                                                {member.phone || member.email || '—'}
                                            </span>
                                            <div>
                                                <span className={`lead-status ${member.isActive !== false ? 'new' : 'not_interested'}`}>
                                                    {member.isActive !== false ? 'Active' : 'Inactive'}
                                                </span>
                                            </div>
                                            <div className="lead-quick-actions" onClick={(e) => e.stopPropagation()}>
                                                <button 
                                                    className="quick-action-btn" 
                                                    onClick={() => toggleTeamMemberActive(member.id, member.isActive !== false)}
                                                    title={member.isActive !== false ? 'Deactivate' : 'Activate'}
                                                    style={{ color: member.isActive !== false ? '#f59e0b' : '#10b981' }}
                                                >
                                                    {member.isActive !== false ? <UserX size={14} /> : <UserCheck size={14} />}
                                                </button>
                                                <button 
                                                    className="quick-action-btn" 
                                                    onClick={() => deleteTeamMember(member.id)}
                                                    title="Delete"
                                                    style={{ color: '#ef4444' }}
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        {/* Per-member lead assignment summary */}
                        {salesTeam.length > 0 && (
                            <div style={{ marginTop: '2rem' }}>
                                <h3 style={{ marginBottom: '1rem', fontSize: '1.1rem' }}>📊 Lead Assignment Overview</h3>
                                <div className="leads-stats-row">
                                    {salesTeam.filter(m => m.isActive !== false).map(member => {
                                        const memberLeads = leads.filter(l => l.assignedTo === member.id);
                                        const calledLeads = memberLeads.filter(l => l.callLog && l.callLog.length > 0);
                                        const convertedLeads = memberLeads.filter(l => l.status === 'converted');
                                        return (
                                            <div key={member.id} className="lead-stat-card" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '0.5rem' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', width: '100%' }}>
                                                    <div style={{ width: 28, height: 28, borderRadius: 8, background: 'linear-gradient(135deg, #10b981, #059669)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: 700 }}>
                                                        {member.name?.charAt(0)?.toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <div style={{ fontSize: '0.9rem', fontWeight: 600 }}>{member.name}</div>
                                                        <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.4)' }}>Code: {member.password || '------'}</div>
                                                    </div>
                                                </div>
                                                <div style={{ display: 'flex', gap: '1rem', fontSize: '0.82rem', color: 'rgba(255,255,255,0.6)' }}>
                                                    <span>📋 {memberLeads.length} leads</span>
                                                    <span>📞 {calledLeads.length} called</span>
                                                    <span>🏆 {convertedLeads.length} converted</span>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </main>

            {/* ===== BULK ADD SALES TEAM MODAL ===== */}
            {showBulkAddModal && (
                <div className="modal-overlay" onClick={() => setShowBulkAddModal(false)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>📋 Bulk Add Sales Team</h3>
                            <button className="modal-close" onClick={() => setShowBulkAddModal(false)}>&times;</button>
                        </div>
                        <div className="modal-body">
                            <input type="file" ref={bulkFileInputRef} accept=".csv" hidden onChange={handleBulkFileChange} />
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
                                <button className="modal-btn secondary" type="button" onClick={() => bulkFileInputRef.current?.click()}>
                                    <Upload size={16} /> Upload CSV
                                </button>
                                {bulkCsvFileName && (
                                    <span style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.75)' }}>
                                        📄 {bulkCsvFileName}
                                    </span>
                                )}
                            </div>
                            <textarea
                                placeholder="Enter one salesperson name per line or paste full CSV text with full_name,email,phone_number"
                                value={bulkInput}
                                onChange={e => setBulkInput(e.target.value)}
                                rows={8}
                                style={{ width: '100%', resize: 'vertical' }}
                            />
                            <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.6)', marginTop: '0.4rem' }}>
                                A random 8-character alphanumeric access code will be generated for each entry.
                            </p>
                        </div>
                        {bulkEntries.length > 0 && (
                            <div style={{ marginBottom: '1rem', color: 'rgba(255,255,255,0.8)' }}>
                                <h4 style={{ margin: '0 0 0.5rem' }}>Parsed CSV Preview</h4>
                                <div style={{ maxHeight: '180px', overflowY: 'auto', background: 'rgba(255,255,255,0.04)', borderRadius: '10px', padding: '0.75rem' }}>
                                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                                        <thead>
                                            <tr>
                                                <th style={{ textAlign: 'left', padding: '0.35rem 0.5rem' }}>Name</th>
                                                <th style={{ textAlign: 'left', padding: '0.35rem 0.5rem' }}>Email</th>
                                                <th style={{ textAlign: 'left', padding: '0.35rem 0.5rem' }}>Phone</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {bulkEntries.map((entry, idx) => (
                                                <tr key={idx} style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                                                    <td style={{ padding: '0.35rem 0.5rem' }}>{entry.name}</td>
                                                    <td style={{ padding: '0.35rem 0.5rem' }}>{entry.email || '—'}</td>
                                                    <td style={{ padding: '0.35rem 0.5rem' }}>{entry.phone || '—'}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
                        <div className="modal-actions">
                            <button className="modal-btn" onClick={() => setShowBulkAddModal(false)}>Cancel</button>
                            <button className="modal-btn primary" onClick={() => handleBulkCreate()} disabled={!bulkInput.trim()}>
                                <UserCheck size={16} /> Create Members
                            </button>
                        </div>
                        {bulkResult.length > 0 && (
                            <div className="bulk-result" style={{ marginTop: '1rem' }}>
                                <h4>Creation Result</h4>
                                <table className="bulk-result-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
                                    <thead>
                                        <tr>
                                            <th>Name</th>
                                            <th>Email</th>
                                            <th>Phone</th>
                                            <th>Password</th>
                                            <th>Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {bulkResult.map((r, i) => (
                                            <tr key={i} style={{ background: r.success ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)' }}>
                                                <td>{r.name}</td>
                                                <td>{r.email || '—'}</td>
                                                <td>{r.phone || '—'}</td>
                                                <td>{r.password}</td>
                                                <td>{r.success ? '✅ Added' : `❌ ${r.error}`}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* ===== ADD LEAD MODAL ===== */}
            {showAddLeadModal && (
                <div className="modal-overlay" onClick={() => setShowAddLeadModal(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>➕ Add New Lead</h3>
                            <button className="modal-close" onClick={() => setShowAddLeadModal(false)}>&times;</button>
                        </div>
                        <div className="lead-form-grid">
                            <div className="lead-form-group">
                                <label>Name *</label>
                                <input
                                    type="text"
                                    placeholder="Full name"
                                    value={newLead.name}
                                    onChange={(e) => setNewLead(p => ({ ...p, name: e.target.value }))}
                                />
                            </div>
                            <div className="lead-form-group">
                                <label>Email</label>
                                <input
                                    type="email"
                                    placeholder="email@example.com"
                                    value={newLead.email}
                                    onChange={(e) => setNewLead(p => ({ ...p, email: e.target.value }))}
                                />
                            </div>
                            <div className="lead-form-group">
                                <label>Phone *</label>
                                <input
                                    type="tel"
                                    placeholder="+91XXXXXXXXXX"
                                    value={newLead.phone}
                                    onChange={(e) => setNewLead(p => ({ ...p, phone: e.target.value }))}
                                />
                            </div>
                            <div className="lead-form-group">
                                <label>WhatsApp</label>
                                <input
                                    type="tel"
                                    placeholder="Same as phone if blank"
                                    value={newLead.whatsapp}
                                    onChange={(e) => setNewLead(p => ({ ...p, whatsapp: e.target.value }))}
                                />
                            </div>
                            <div className="lead-form-group">
                                <label>Status</label>
                                <select
                                    value={newLead.status}
                                    onChange={(e) => setNewLead(p => ({ ...p, status: e.target.value }))}
                                >
                                    <option value="new">New</option>
                                    <option value="contacted">Contacted</option>
                                    <option value="interested">Interested</option>
                                    <option value="converted">Converted</option>
                                    <option value="not_interested">Not Interested</option>
                                </select>
                            </div>
                            <div className="lead-form-group full-width">
                                <label>Notes</label>
                                <textarea
                                    placeholder="Any notes about this lead..."
                                    value={newLead.notes}
                                    onChange={(e) => setNewLead(p => ({ ...p, notes: e.target.value }))}
                                    rows="3"
                                />
                            </div>
                        </div>
                        <div className="modal-actions">
                            <button className="modal-btn" onClick={() => setShowAddLeadModal(false)}>Cancel</button>
                            <button className="modal-btn primary" onClick={addLead}>
                                <UserPlus size={16} /> Add Lead
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ===== CSV IMPORT MODAL ===== */}
            {showImportModal && (
                <div className="modal-overlay" onClick={() => setShowImportModal(false)}>
                    <div className="modal-content wide" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>📥 Import Leads from CSV</h3>
                            <button className="modal-close" onClick={() => setShowImportModal(false)}>&times;</button>
                        </div>
                        
                        {/* Tab Headers */}
                        <div className="csv-tabs">
                            <button 
                                className={`csv-tab-btn ${importTab === 'file' ? 'active' : ''}`}
                                onClick={() => setImportTab('file')}
                            >
                                <Upload size={16} /> Upload CSV File
                            </button>
                            <button 
                                className={`csv-tab-btn ${importTab === 'paste' ? 'active' : ''}`}
                                onClick={() => setImportTab('paste')}
                            >
                                <FileText size={16} /> Paste CSV Text
                            </button>
                        </div>

                        <div className="csv-import-area">
                            {importTab === 'file' ? (
                                <div 
                                    className={`csv-dropzone ${dragActive ? 'drag-active' : ''}`}
                                    onDragEnter={handleDrag}
                                    onDragOver={handleDrag}
                                    onDragLeave={handleDrag}
                                    onDrop={handleDrop}
                                    onClick={() => !csvFileName && fileInputRef.current?.click()}
                                >
                                    <input 
                                        type="file" 
                                        ref={fileInputRef}
                                        className="csv-file-input" 
                                        accept=".csv" 
                                        onChange={handleFileChange} 
                                    />
                                    <div className="csv-dropzone-label">
                                        <div className="dropzone-icon">
                                            <Upload size={32} />
                                        </div>
                                        {csvFileName ? (
                                            <div className="uploaded-file-info">
                                                <span className="file-name">📄 {csvFileName}</span>
                                                <button 
                                                    className="clear-file-btn" 
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setCsvFileName('');
                                                        setCsvData('');
                                                        if (fileInputRef.current) fileInputRef.current.value = '';
                                                    }}
                                                >
                                                    Remove file
                                                </button>
                                            </div>
                                        ) : (
                                            <>
                                                <span className="dropzone-title">Drag & drop your CSV file here</span>
                                                <span className="dropzone-or">or</span>
                                                <span className="dropzone-browse-btn">Browse files</span>
                                            </>
                                        )}
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <textarea
                                        className="csv-textarea"
                                        placeholder={`Name, Email, Phone, WhatsApp\nJohn Doe, john@email.com, +919876543210, +919876543210\nJane Smith, jane@email.com, +918765432109`}
                                        value={csvData}
                                        onChange={(e) => setCsvData(e.target.value)}
                                    />
                                    <p className="csv-hint">
                                        Format: <strong>full_name, email, phone_number</strong> (one per line) — WhatsApp is optional and will default to phone if missing.<br />
                                        Supports comma `,`, semicolon `;`, or tab `\t` as separator.
                                    </p>
                                </>
                            )}

                            {/* Options */}
                            {parsedLeads.length > 0 && (
                                <div className="csv-options">
                                    <label className="csv-checkbox-label">
                                        <input 
                                            type="checkbox" 
                                            checked={skipHeader} 
                                            onChange={(e) => setSkipHeader(e.target.checked)} 
                                        />
                                        First row contains column headers (skip first row)
                                    </label>
                                </div>
                            )}

                            {/* Preview Section */}
                            {parsedLeads.length > 0 && (
                                <div className="csv-preview-section">
                                    <div className="csv-preview-header">
                                        <h4>📋 Parsed Leads Preview ({parsedLeads.filter(l => l.isValid).length} valid, {parsedLeads.filter(l => !l.isValid).length} invalid)</h4>
                                        <div className="csv-select-all-toggle">
                                            <button 
                                                className="link-btn"
                                                onClick={() => setParsedLeads(prev => prev.map(l => l.isValid ? { ...l, selected: true } : l))}
                                            >
                                                Select All
                                            </button>
                                            <span className="divider">|</span>
                                            <button 
                                                className="link-btn"
                                                onClick={() => setParsedLeads(prev => prev.map(l => ({ ...l, selected: false })))}
                                            >
                                                Deselect All
                                            </button>
                                        </div>
                                    </div>
                                    <div className="csv-preview-table-container">
                                        <table className="csv-preview-table">
                                            <thead>
                                                <tr>
                                                    <th style={{ width: '40px' }}></th>
                                                    <th>Name</th>
                                                    <th>Email</th>
                                                    <th>Phone</th>
                                                    <th>WhatsApp</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {parsedLeads.map((lead, idx) => (
                                                    <tr key={idx} className={`csv-preview-row ${!lead.isValid ? 'invalid' : ''} ${lead.selected ? 'selected' : ''}`}>
                                                        <td>
                                                            <input 
                                                                type="checkbox" 
                                                                checked={lead.selected} 
                                                                disabled={!lead.isValid}
                                                                onChange={(e) => {
                                                                    const updated = [...parsedLeads];
                                                                    updated[idx].selected = e.target.checked;
                                                                    setParsedLeads(updated);
                                                                }}
                                                            />
                                                        </td>
                                                        <td className="lead-cell-name">
                                                            {lead.name || <span className="cell-error"><AlertCircle size={12} /> Name is missing</span>}
                                                        </td>
                                                        <td>{lead.email || <span className="cell-empty">-</span>}</td>
                                                        <td>{lead.phone || <span className="cell-empty">-</span>}</td>
                                                        <td>{lead.whatsapp || <span className="cell-empty">-</span>}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="modal-actions">
                            <button className="modal-btn" onClick={() => setShowImportModal(false)}>Cancel</button>
                            <button 
                                className="modal-btn primary" 
                                onClick={importCSV} 
                                disabled={parsedLeads.filter(l => l.selected && l.isValid).length === 0}
                            >
                                <Upload size={16} /> Import {parsedLeads.filter(l => l.selected && l.isValid).length} Lead{parsedLeads.filter(l => l.selected && l.isValid).length !== 1 ? 's' : ''}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ===== EMAIL COMPOSE MODAL ===== */}
            {showComposeModal && (
                <div className="modal-overlay" onClick={() => setShowComposeModal(false)}>
                    <div className="modal-content wide" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>📧 Compose Bulk Email</h3>
                            <button className="modal-close" onClick={() => setShowComposeModal(false)}>&times;</button>
                        </div>

                        <div>
                            <label style={{ fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.04em', color: 'rgba(255,255,255,0.45)', marginBottom: '0.4rem', display: 'block' }}>
                                Recipients ({leads.filter(l => selectedLeadIds.has(l.id) && l.email).length})
                            </label>
                            <div className="compose-recipients">
                                {leads.filter(l => selectedLeadIds.has(l.id) && l.email).map(l => (
                                    <span key={l.id} className="recipient-chip">
                                        <Mail size={10} /> {l.email}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div className="compose-field">
                            <label>Subject</label>
                            <input
                                type="text"
                                placeholder="Email subject line..."
                                value={emailSubject}
                                onChange={(e) => setEmailSubject(e.target.value)}
                            />
                        </div>

                        <div className="compose-field">
                            <label>Message Body</label>
                            <textarea
                                placeholder="Write your email message here..."
                                value={emailBody}
                                onChange={(e) => setEmailBody(e.target.value)}
                            />
                        </div>

                        <div className="compose-actions">
                            <button className="modal-btn" onClick={copyEmails}>
                                <Copy size={14} /> Copy Emails
                            </button>
                            <button className="modal-btn primary" onClick={sendBulkEmail}>
                                <Send size={14} /> Open in Email Client
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ===== WHATSAPP TEMPLATE MODAL ===== */}
            {showWhatsAppModal && (
                <div className="modal-overlay" onClick={() => setShowWhatsAppModal(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>💬 Bulk WhatsApp Message</h3>
                            <button className="modal-close" onClick={() => setShowWhatsAppModal(false)}>&times;</button>
                        </div>

                        <div>
                            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.88rem', marginBottom: '1rem' }}>
                                Sending to <strong>{leads.filter(l => selectedLeadIds.has(l.id) && (l.whatsapp || l.phone)).length}</strong> contacts. 
                                WhatsApp Web will open for each contact with your pre-filled message.
                            </p>
                        </div>

                        <div className="compose-field">
                            <label>Message Template</label>
                            <textarea
                                placeholder="Hi! I'm reaching out from BIXSOL regarding..."
                                value={waMessage}
                                onChange={(e) => setWaMessage(e.target.value)}
                            />
                        </div>

                        <div className="modal-actions">
                            <button className="modal-btn" onClick={() => setShowWhatsAppModal(false)}>Cancel</button>
                            <button className="modal-btn primary" onClick={sendBulkWhatsApp}>
                                <MessageCircle size={16} /> Send to All
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ===== ADD TEAM MEMBER MODAL ===== */}
            {showAddTeamMemberModal && (
                <div className="modal-overlay" onClick={() => setShowAddTeamMemberModal(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>👤 Add Sales Team Member</h3>
                            <button className="modal-close" onClick={() => setShowAddTeamMemberModal(false)}>&times;</button>
                        </div>

                        <div className="compose-field">
                            <p className="csv-hint" style={{ marginTop: '0.2rem', color: 'rgba(255,255,255,0.8)' }}>
                                Each salesperson will receive a unique 6-digit portal access code automatically.
                            </p>
                        </div>

                        <div className="compose-field">
                            <label>Full Name *</label>
                            <input
                                type="text"
                                placeholder="e.g., Ravi Kumar"
                                value={newTeamMember.name}
                                onChange={(e) => setNewTeamMember(prev => ({ ...prev, name: e.target.value }))}
                            />
                        </div>

                        <div className="compose-field">
                            <label>Phone Number</label>
                            <input
                                type="text"
                                placeholder="e.g., +919876543210"
                                value={newTeamMember.phone}
                                onChange={(e) => setNewTeamMember(prev => ({ ...prev, phone: e.target.value }))}
                            />
                        </div>

                        <div className="compose-field">
                            <label>Email Address</label>
                            <input
                                type="email"
                                placeholder="e.g., ravi@bixsol.com"
                                value={newTeamMember.email}
                                onChange={(e) => setNewTeamMember(prev => ({ ...prev, email: e.target.value }))}
                            />
                        </div>

                        <div className="modal-actions">
                            <button className="modal-btn" onClick={() => setShowAddTeamMemberModal(false)}>Cancel</button>
                            <button className="modal-btn primary" onClick={addTeamMember}>
                                <UserPlus size={16} /> Add Member
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ===== ASSIGN LEADS MODAL ===== */}
            {showAssignModal && (
                <div className="modal-overlay" onClick={() => setShowAssignModal(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>🎯 Assign {selectedLeadIds.size} Lead{selectedLeadIds.size !== 1 ? 's' : ''}</h3>
                            <button className="modal-close" onClick={() => setShowAssignModal(false)}>&times;</button>
                        </div>

                        <div>
                            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.88rem', marginBottom: '1.2rem' }}>
                                Select a sales team member to assign the {selectedLeadIds.size} selected lead{selectedLeadIds.size !== 1 ? 's' : ''} to.
                            </p>
                        </div>

                        <div className="compose-field">
                            <label>Select Salesperson</label>
                            <select
                                className="filter-select"
                                style={{ width: '100%', padding: '0.6rem', background: '#1c1917', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '6px', color: '#fff' }}
                                value={assignTarget}
                                onChange={(e) => setAssignTarget(e.target.value)}
                            >
                                <option value="">-- Choose Salesperson --</option>
                                <option value="unassigned">❌ Unassign Leads</option>
                                {salesTeam.filter(m => m.isActive !== false).map(member => (
                                    <option key={member.id} value={member.id}>
                                        👤 {member.name} ({member.password || 'no code'})
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="modal-actions">
                            <button className="modal-btn" onClick={() => setShowAssignModal(false)}>Cancel</button>
                            <button 
                                className="modal-btn primary" 
                                onClick={() => {
                                    if (assignTarget === 'unassigned') {
                                        unassignLeads();
                                    } else if (assignTarget) {
                                        assignLeadsToMember(assignTarget);
                                    } else {
                                        showToast('⚠️ Please select a salesperson');
                                    }
                                }}
                                disabled={!assignTarget}
                            >
                                <UserCheck size={16} /> Confirm Assignment
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminPanel;
