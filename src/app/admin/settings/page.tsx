'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { FaSave, FaCheck, FaTimes, FaUpload, FaFilePdf, FaImage, FaFileWord } from 'react-icons/fa'

interface SiteSettings {
    heroTitle: string
    heroSubtitle: string
    statsProjects: string
    statsClients: string
    statsExperience: string
    statsSupport: string
    businessRegistrationUrl: string | null
}

export default function SettingsPage() {
    const router = useRouter()
    const [settings, setSettings] = useState<SiteSettings>({
        heroTitle: '',
        heroSubtitle: '',
        statsProjects: '',
        statsClients: '',
        statsExperience: '',
        statsSupport: '',
        businessRegistrationUrl: null
    })
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [uploading, setUploading] = useState(false)
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        const token = localStorage.getItem('admin_token')
        if (!token) {
            router.push('/admin/login')
            return
        }
        fetchSettings()
    }, [router])

    const fetchSettings = async () => {
        try {
            const token = localStorage.getItem('admin_token')
            const res = await fetch('/api/v1/admin/settings', {
                headers: { 'Authorization': `Bearer ${token}` }
            })
            const data = await res.json()
            if (data.success && data.data) {
                setSettings(data.data)
            }
        } catch (e) {
            console.error(e)
        } finally {
            setLoading(false)
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setSettings({ ...settings, [e.target.name]: e.target.value })
    }

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        setUploading(true)
        setMessage(null)

        const formData = new FormData()
        formData.append('file', file)

        try {
            const token = localStorage.getItem('admin_token')
            const res = await fetch('/api/v1/admin/upload/document', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            })

            const data = await res.json()

            if (data.success && data.data?.url) {
                const newSettings = { ...settings, businessRegistrationUrl: data.data.url }
                setSettings(newSettings)

                // Auto-save the settings
                try {
                    const saveRes = await fetch('/api/v1/admin/settings', {
                        method: 'PUT',
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(newSettings)
                    })
                    const saveData = await saveRes.json()
                    if (saveData.success) {
                        setMessage({ type: 'success', text: 'Document uploaded and settings saved successfully!' })
                    } else {
                        setMessage({ type: 'error', text: 'Document uploaded but failed to save settings.' })
                    }
                } catch (e) {
                    setMessage({ type: 'error', text: 'Document uploaded but failed to save settings.' })
                }
            } else {
                setMessage({ type: 'error', text: data.error || 'Failed to upload document' })
            }
        } catch (error) {
            console.error('Upload error:', error)
            setMessage({ type: 'error', text: 'An error occurred during upload' })
        } finally {
            setUploading(false)
            if (fileInputRef.current) {
                fileInputRef.current.value = ''
            }
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setSaving(true)
        setMessage(null)

        try {
            const token = localStorage.getItem('admin_token')
            const res = await fetch('/api/v1/admin/settings', {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(settings)
            })
            const data = await res.json()
            if (data.success) {
                setMessage({ type: 'success', text: 'Settings saved successfully!' })
            } else {
                setMessage({ type: 'error', text: data.error || 'Failed to save settings' })
            }
        } catch (e) {
            setMessage({ type: 'error', text: 'An error occurred while saving' })
        } finally {
            setSaving(false)
            setTimeout(() => setMessage(null), 3000)
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        )
    }

    return (
        <div className="max-w-4xl mx-auto">
            <div className="mb-8">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Site Settings</h1>
                <p className="text-gray-500 mt-1">Manage your homepage content and statistics</p>
            </div>

            {message && (
                <div className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${message.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'}`}>
                    {message.type === 'success' ? <FaCheck /> : <FaTimes />}
                    <p>{message.text}</p>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
                {/* Hero Section Settings */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                        <h2 className="font-semibold text-gray-800">Homepage Hero Section</h2>
                    </div>
                    <div className="p-6 space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Hero Title</label>
                            <input
                                type="text"
                                name="heroTitle"
                                value={settings.heroTitle}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Hero Subtitle</label>
                            <textarea
                                name="heroSubtitle"
                                value={settings.heroSubtitle}
                                onChange={handleChange}
                                rows={3}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                                required
                            />
                        </div>
                    </div>
                </div>

                {/* Statistics Settings */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                        <h2 className="font-semibold text-gray-800">Homepage Statistics</h2>
                    </div>
                    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Projects Completed (e.g., "50+")</label>
                            <input
                                type="text"
                                name="statsProjects"
                                value={settings.statsProjects}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Happy Clients (e.g., "30+")</label>
                            <input
                                type="text"
                                name="statsClients"
                                value={settings.statsClients}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Years Experience (e.g., "5+")</label>
                            <input
                                type="text"
                                name="statsExperience"
                                value={settings.statsExperience}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Support (e.g., "24/7")</label>
                            <input
                                type="text"
                                name="statsSupport"
                                value={settings.statsSupport}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                                required
                            />
                        </div>
                    </div>
                </div>

                {/* Documents Settings */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                        <h2 className="font-semibold text-gray-800">Company Documents</h2>
                    </div>
                    <div className="p-6 space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Business Registration Document</label>
                            <p className="text-sm text-gray-500 mb-4">Upload your company's business registration document to display it on the main website footer.</p>

                            <div className="flex items-center gap-4">
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleFileUpload}
                                    className="hidden"
                                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                                />
                                <button
                                    type="button"
                                    onClick={() => fileInputRef.current?.click()}
                                    disabled={uploading}
                                    className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
                                >
                                    {uploading ? (
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-700"></div>
                                    ) : (
                                        <FaUpload />
                                    )}
                                    {uploading ? 'Uploading...' : 'Upload Document'}
                                </button>

                                {settings.businessRegistrationUrl && (
                                    <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 px-3 py-1.5 rounded-md border border-green-200">
                                        <FaCheck /> Document uploaded
                                        <a
                                            href={settings.businessRegistrationUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="ml-2 text-primary hover:underline"
                                        >
                                            View
                                        </a>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end">
                    <button
                        type="submit"
                        disabled={saving}
                        className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primaryDark transition-colors disabled:opacity-50"
                    >
                        {saving ? (
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        ) : (
                            <FaSave />
                        )}
                        {saving ? 'Saving...' : 'Save Settings'}
                    </button>
                </div>
            </form>
        </div>
    )
}
