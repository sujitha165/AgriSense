import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  BookmarkCheck,
  Calendar,
  ArrowLeft,
  Activity,
  Leaf,
  MapPin,
  Thermometer,
  Droplets,
  FlaskConical,
  Sprout,
  PhoneCall,
  CloudRain
} from 'lucide-react';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { ConfidenceMeter } from '../components/detection/ConfidenceMeter';
import { SeverityIndicator } from '../components/detection/SeverityIndicator';
import { useLanguage } from '../context/LanguageContext';
import { useToast } from '../context/ToastContext';
import { diseaseService } from '../services/diseaseService';
import { locationService, LocationEnvironment, LocationTreatmentAdvice, SUPPORTED_LOCATION_STATES } from '../services/locationService';
import { ScanRecord } from '../types';
import { formatDate, getSeverityStyles } from '../utils/formatters';

export const ResultPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const { showToast } = useToast();

  const [scan, setScan] = useState<ScanRecord | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [activeTab, setActiveTab] = useState<'immediate' | 'treatment' | 'prevention' | 'monitoring'>('immediate');

  // GPS State
  const [locationEnv, setLocationEnv] = useState<LocationEnvironment | null>(null);
  const [locationAdvice, setLocationAdvice] = useState<LocationTreatmentAdvice | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [placeName, setPlaceName] = useState<string>('');
  const [selectedState, setSelectedState] = useState('Tamil Nadu');
  const [locationSource, setLocationSource] = useState<'gps' | 'selected' | null>(null);

  useEffect(() => {
    async function fetchScan() {
      if (!id) return;
      try {
        const data = await diseaseService.getScanById(parseInt(id, 10));
        setScan(data);
      } catch (err) {
        console.error('Failed to load scan:', err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchScan();
  }, [id]);

  const applyLocationTreatment = useCallback((env: LocationEnvironment, source: 'gps' | 'selected') => {
    if (!scan) return;
    setLocationEnv(env);
    setLocationSource(source);
    setPlaceName(env.locationLabel);
    setLocationAdvice(locationService.getLocationBasedTreatment(scan.disease, scan.severity, scan.crop, env));
    showToast(`Location-based treatment ready for ${env.state}.`, 'success');
  }, [scan, showToast]);

  // Request GPS and generate location-based advice
  const handleGetLocationTreatment = useCallback(async () => {
    setIsLocating(true);
    try {
      const gps = await locationService.getCurrentLocation();
      let place;

      // Reverse geocode for human-readable name
      try {
        place = await locationService.reverseGeocode(gps.latitude, gps.longitude);
      } catch {
        place = undefined;
      }

      const env = locationService.getEnvironmentFromGPS(gps, place?.state);
      env.locationLabel = place?.label || env.locationLabel;
      applyLocationTreatment(env, 'gps');
    } catch (err: any) {
      showToast(err.message || 'GPS unavailable', 'error');
    } finally {
      setIsLocating(false);
    }
  }, [applyLocationTreatment]);

  const handleSelectedLocationTreatment = () => {
    applyLocationTreatment(locationService.getEnvironmentForState(selectedState), 'selected');
  };

  const handleSaveTreatmentPlan = async () => {
    if (!scan) return;
    setIsSaving(true);
    await diseaseService.saveTreatment({
      scan_id: scan.id,
      immediate_action: scan.treatment ? scan.treatment[0] : 'Isolate and monitor affected leaves.',
      treatment_plan: scan.treatment || [],
      prevention: scan.prevention || [],
      monitoring: scan.monitoring || 'Inspect plot every 3 days.',
      expert_warning: scan.expert_warning
    });
    setIsSaving(false);
    setIsSaved(true);
    showToast(t('results.savedSuccess'), 'success');
  };

  if (isLoading) {
    return (
      <div className="py-24 text-center space-y-4">
        <div className="w-12 h-12 rounded-full border-4 border-agri-600 border-t-transparent animate-spin mx-auto" />
        <p className="text-sm font-medium text-stone-500">Loading diagnostic report...</p>
      </div>
    );
  }

  if (!scan) {
    return (
      <div className="bg-white dark:bg-darkbg-card rounded-3xl p-12 text-center max-w-lg mx-auto space-y-4 border border-stone-200 dark:border-darkbg-border">
        <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto" />
        <h3 className="text-lg font-bold text-stone-900 dark:text-stone-100">Scan Report Not Found</h3>
        <p className="text-xs text-stone-500">The requested disease report is unavailable or expired.</p>
        <Button onClick={() => navigate('/detect')}>Scan New Crop</Button>
      </div>
    );
  }

  const severityStyle = getSeverityStyles(scan.severity);
  const needsVerification = scan.confidence < 40 || Boolean(scan.crop_mismatch);

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Top Breadcrumb & Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <Link
          to="/detect"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-500 hover:text-stone-800 dark:hover:text-stone-200 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          {t('results.backToDetect')}
        </Link>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/history')}
          >
            {t('results.viewHistory')}
          </Button>

          <Button
            size="sm"
            onClick={handleSaveTreatmentPlan}
            disabled={isSaved || needsVerification}
            isLoading={isSaving}
            icon={isSaved ? <CheckCircle2 className="w-4 h-4" /> : <BookmarkCheck className="w-4 h-4" />}
            className={isSaved ? 'bg-emerald-700 hover:bg-emerald-700' : ''}
          >
            {isSaved ? 'Treatment Plan Saved' : t('results.savePlan')}
          </Button>
        </div>
      </div>

      {/* Main Diagnosis Highlight Card */}
      <div className="bg-white dark:bg-darkbg-card border border-stone-200 dark:border-darkbg-border rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Crop Photo */}
          <div className="lg:col-span-5 relative rounded-2xl overflow-hidden bg-stone-950 shadow-md">
            <img
              src={scan.image_url}
              alt={scan.disease}
              className="w-full aspect-4/3 object-cover"
            />
            <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md text-white px-2.5 py-1 rounded-lg text-xs font-mono">
              ID: CS-{scan.id}
            </div>
            <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-[11px] text-stone-200 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-xl">
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                {formatDate(scan.created_at)}
              </span>
              <span>Crop: {scan.crop}</span>
            </div>
          </div>

          {/* Right: Diagnosis Title & Primary Metrics */}
          <div className="lg:col-span-7 space-y-5">
            <div className="space-y-1">
              <span className="text-xs font-bold text-stone-400 uppercase tracking-wider">
                {scan.crop} Leaf Diagnosis
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 dark:text-stone-100 tracking-tight flex items-center gap-2">
                {scan.crop} {scan.disease}
              </h1>
              {scan.pathogen && scan.pathogen !== 'None' && (
                <p className="text-xs text-stone-500 dark:text-stone-400 italic">
                  Pathogen: {scan.pathogen}
                </p>
              )}
            </div>

            {/* Meters: Confidence & Severity */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <ConfidenceMeter confidence={scan.confidence} />
              <SeverityIndicator severity={scan.severity} />
            </div>

            <div className="rounded-xl border border-sky-200 dark:border-sky-900/60 bg-sky-50 dark:bg-sky-950/30 px-4 py-3 text-xs text-sky-800 dark:text-sky-200">
              <p className="font-semibold">Real image-model result</p>
              <p className="mt-1">{scan.confidence_note || "The percentage is the model's confidence score, not a guarantee of field-level accuracy. Disease severity is not inferred from this classifier."}</p>
            </div>

            {needsVerification && (
              <div className="rounded-xl border border-amber-200 dark:border-amber-900/60 bg-amber-50 dark:bg-amber-950/30 px-4 py-3 text-xs text-amber-900 dark:text-amber-200">
                <p className="font-semibold">Verification needed before treatment</p>
                <p className="mt-1">
                  {scan.crop_mismatch
                    ? `The AI detected ${scan.crop}, which differs from the selected crop.`
                    : 'The model confidence is too low for a dependable diagnosis.'}
                  {' '}Retake a clear, close-up photo of one leaf in natural light and verify the selected crop before acting on this result.
                </p>
              </div>
            )}

            {scan.top_predictions && scan.top_predictions.length > 1 && (
              <div className="rounded-xl border border-stone-200 dark:border-darkbg-border bg-stone-50 dark:bg-darkbg-input px-4 py-3">
                <p className="text-xs font-bold text-stone-700 dark:text-stone-200">Top model predictions</p>
                <div className="mt-2 space-y-1.5">
                  {scan.top_predictions.map((prediction, index) => (
                    <div key={`${prediction.label}-${index}`} className="flex items-center justify-between text-xs">
                      <span className="text-stone-600 dark:text-stone-300">{index + 1}. {prediction.label}</span>
                      <span className="font-semibold text-stone-900 dark:text-stone-100">{prediction.confidence.toFixed(2)}%</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Expert Warning Banner if severe/moderate */}
            {scan.severity !== 'Healthy' && (
              <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/80 rounded-2xl p-4 text-xs text-amber-900 dark:text-amber-200 flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                <p className="leading-relaxed">
                  <span className="font-bold">Agronomist Advisory: </span>
                  {scan.expert_warning || t('results.expertWarning')}
                </p>
              </div>
            )}

            {/* GPS Treatment CTA */}
            {locationAdvice ? (
              <div className="flex items-center gap-2 px-4 py-2.5 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60 rounded-xl text-xs">
                <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="text-emerald-700 dark:text-emerald-300 font-medium">
                  {placeName || locationEnv?.locationLabel} - {locationSource === 'gps' ? 'GPS' : 'regional'} treatment below
                </span>
                <button
                  onClick={handleGetLocationTreatment}
                  disabled={isLocating}
                  className="ml-auto text-emerald-600 hover:text-emerald-800 font-semibold"
                >
                  Refresh
                </button>
              </div>
            ) : needsVerification ? (
              <div className="flex items-start gap-3 rounded-xl border border-amber-200 dark:border-amber-900/60 bg-amber-50 dark:bg-amber-950/30 px-4 py-3 text-xs text-amber-900 dark:text-amber-200">
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                <p>Location-specific treatment is available after a reliable diagnosis. Upload a clearer single-leaf photo and confirm the crop first.</p>
              </div>
            ) : (
              <div className="space-y-3">
                <button
                  onClick={handleGetLocationTreatment}
                  disabled={isLocating}
                  className="w-full flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 disabled:opacity-60 text-white rounded-2xl transition-all shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30 hover:scale-[1.01] active:scale-[0.99]"
                >
                  {isLocating ? (
                    <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin shrink-0" />
                  ) : (
                    <MapPin className="w-5 h-5 shrink-0" />
                  )}
                  <div className="text-left">
                    <p className="text-sm font-bold">{isLocating ? 'Getting GPS Location...' : 'Use My Location for Treatment'}</p>
                    <p className="text-xs text-emerald-100">Regional soil, rainfall, humidity, season, and KVK support are included.</p>
                  </div>
                </button>
                <div className="flex flex-wrap items-center gap-2">
                  <label htmlFor="treatment-state" className="text-xs font-semibold text-stone-600 dark:text-stone-300">Or select your state</label>
                  <select
                    id="treatment-state"
                    value={selectedState}
                    onChange={event => setSelectedState(event.target.value)}
                    className="min-w-40 flex-1 rounded-lg border border-stone-300 dark:border-darkbg-border bg-white dark:bg-darkbg-input px-2.5 py-2 text-xs text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-agri-500"
                  >
                    {SUPPORTED_LOCATION_STATES.map(state => <option key={state} value={state}>{state}</option>)}
                  </select>
                  <Button type="button" size="sm" variant="outline" onClick={handleSelectedLocationTreatment} icon={<MapPin className="w-4 h-4" />}>
                    Apply Region
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* GPS Location-Based Treatment Panel */}
      {locationAdvice && locationEnv && (
        <div className="bg-gradient-to-br from-emerald-50 to-teal-50/50 dark:from-emerald-950/30 dark:to-teal-950/20 border border-emerald-200 dark:border-emerald-800/60 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
          {/* Header */}
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-lg shadow-emerald-600/30">
              <MapPin className="w-6 h-6" />
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-xl font-bold text-stone-900 dark:text-stone-100">
                Location-Based Treatment Advice
              </h2>
              <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5 truncate">
                {locationAdvice.locationSummary}
              </p>
            </div>
          </div>

          {/* Weather Alert */}
          {locationAdvice.weatherAlert && (
            <div className="flex items-start gap-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/80 rounded-2xl p-4 text-xs text-amber-900 dark:text-amber-200">
              <CloudRain className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <p className="leading-relaxed">{locationAdvice.weatherAlert}</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Environmental Risk Factors */}
            <div className="bg-white dark:bg-darkbg-card border border-stone-200 dark:border-darkbg-border rounded-2xl p-5 space-y-3">
              <div className="flex items-center gap-2 font-bold text-stone-900 dark:text-stone-100 text-sm">
                <Thermometer className="w-4 h-4 text-rose-500" />
                <span>Local Environmental Risks</span>
                <Badge variant="amber" size="sm">{locationEnv.state}</Badge>
              </div>
              {/* Env stats */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-stone-50 dark:bg-darkbg-input rounded-xl p-2.5">
                  <span className="text-stone-400 block text-[10px] uppercase tracking-wider">Season</span>
                  <span className="font-semibold text-stone-900 dark:text-stone-100">{locationEnv.season}</span>
                </div>
                <div className="bg-stone-50 dark:bg-darkbg-input rounded-xl p-2.5">
                  <span className="text-stone-400 block text-[10px] uppercase tracking-wider">Humidity</span>
                  <span className="font-semibold text-stone-900 dark:text-stone-100 capitalize">{locationEnv.humidity}</span>
                </div>
                <div className="bg-stone-50 dark:bg-darkbg-input rounded-xl p-2.5">
                  <span className="text-stone-400 block text-[10px] uppercase tracking-wider">Rainfall</span>
                  <span className="font-semibold text-stone-900 dark:text-stone-100 capitalize">{locationEnv.avgRainfall}</span>
                </div>
                <div className="bg-stone-50 dark:bg-darkbg-input rounded-xl p-2.5 col-span-2">
                  <span className="text-stone-400 block text-[10px] uppercase tracking-wider">Soil Type</span>
                  <span className="font-semibold text-stone-900 dark:text-stone-100 text-[11px]">{locationEnv.soilType}</span>
                </div>
              </div>
              {/* Risk factors */}
              <ul className="space-y-2">
                {locationAdvice.environmentalRiskFactors.map((r, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-stone-600 dark:text-stone-300">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                    <span>{r}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Region-Specific Treatment Modifications */}
            <div className="bg-white dark:bg-darkbg-card border border-stone-200 dark:border-darkbg-border rounded-2xl p-5 space-y-3">
              <div className="flex items-center gap-2 font-bold text-stone-900 dark:text-stone-100 text-sm">
                <Droplets className="w-4 h-4 text-blue-500" />
                <span>Treatment Modifications</span>
              </div>
              <ul className="space-y-2.5">
                {locationAdvice.localTreatmentModifications.map((m, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-stone-600 dark:text-stone-300 bg-stone-50 dark:bg-darkbg-input p-2.5 rounded-xl border border-stone-100 dark:border-darkbg-border">
                    <CheckCircle2 className="w-3.5 h-3.5 text-agri-600 shrink-0 mt-0.5" />
                    <span>{m}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Available Chemicals */}
            <div className="bg-white dark:bg-darkbg-card border border-stone-200 dark:border-darkbg-border rounded-2xl p-5 space-y-3">
              <div className="flex items-center gap-2 font-bold text-stone-900 dark:text-stone-100 text-sm">
                <FlaskConical className="w-4 h-4 text-purple-500" />
                <span>Recommended Chemicals</span>
              </div>
              <ul className="space-y-2">
                {locationAdvice.localChemicalsAvailable.map((c, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-stone-600 dark:text-stone-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-500 shrink-0 mt-2" />
                    <span>{c}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Organic Alternatives */}
            <div className="bg-white dark:bg-darkbg-card border border-stone-200 dark:border-darkbg-border rounded-2xl p-5 space-y-3">
              <div className="flex items-center gap-2 font-bold text-stone-900 dark:text-stone-100 text-sm">
                <Sprout className="w-4 h-4 text-emerald-600" />
                <span>Organic Alternatives</span>
              </div>
              <ul className="space-y-2">
                {locationAdvice.organicAlternatives.map((o, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-stone-600 dark:text-stone-300">
                    <Leaf className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{o}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Local KVK Contact */}
          {locationAdvice.nearestKVK && (
            <div className="flex items-start gap-3 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800/60 rounded-2xl p-4">
              <PhoneCall className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-bold text-blue-800 dark:text-blue-200 mb-1">
                  Local Agricultural Expert Contact:
                </p>
                <p className="text-xs text-blue-700 dark:text-blue-300">{locationAdvice.nearestKVK}</p>
                <p className="text-xs text-blue-500 dark:text-blue-400 mt-1">
                  National Farmer Helpline: <strong>1551</strong> (Toll-Free)
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Disease Information Grid: Symptoms & Causes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Symptoms */}
        <div className="bg-white dark:bg-darkbg-card border border-stone-200 dark:border-darkbg-border rounded-3xl p-6 shadow-xs space-y-3">
          <div className="flex items-center gap-2 text-stone-900 dark:text-stone-100 font-bold text-base">
            <Activity className="w-5 h-5 text-agri-600" />
            <h3>{t('results.symptoms')}</h3>
          </div>
          <ul className="space-y-2 text-xs sm:text-sm text-stone-600 dark:text-stone-300">
            {scan.symptoms && scan.symptoms.map((sym, idx) => (
              <li key={idx} className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-agri-500 shrink-0 mt-2" />
                <span className="leading-relaxed">{sym}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Causes */}
        <div className="bg-white dark:bg-darkbg-card border border-stone-200 dark:border-darkbg-border rounded-3xl p-6 shadow-xs space-y-3">
          <div className="flex items-center gap-2 text-stone-900 dark:text-stone-100 font-bold text-base">
            <ShieldAlert className="w-5 h-5 text-amber-500" />
            <h3>{t('results.causes')}</h3>
          </div>
          <ul className="space-y-2 text-xs sm:text-sm text-stone-600 dark:text-stone-300">
            {scan.causes && scan.causes.map((cause, idx) => (
              <li key={idx} className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0 mt-2" />
                <span className="leading-relaxed">{cause}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Recommended Action Plan */}
      <div className="bg-white dark:bg-darkbg-card border border-stone-200 dark:border-darkbg-border rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 dark:border-darkbg-border pb-4">
          <div>
            <h2 className="text-xl font-bold text-stone-900 dark:text-stone-100">
              {t('results.actionPlan')}
            </h2>
            <p className="text-xs text-stone-500 dark:text-stone-400">
              Tailored agronomic recommendations formulated for your field conditions
            </p>
          </div>

          {/* Action Tabs */}
          <div className="flex flex-wrap gap-2">
            {[
              { key: 'immediate', label: t('results.immediateAction') },
              { key: 'treatment', label: t('results.treatment') },
              { key: 'prevention', label: t('results.prevention') },
              { key: 'monitoring', label: t('results.monitoring') }
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                  activeTab === tab.key
                    ? 'bg-agri-600 text-white shadow-xs'
                    : 'bg-stone-100 dark:bg-darkbg-border text-stone-600 dark:text-stone-300 hover:bg-stone-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="text-xs sm:text-sm text-stone-700 dark:text-stone-200 leading-relaxed min-h-[120px]">
          {activeTab === 'immediate' && (
            <div className="space-y-3 bg-emerald-50/50 dark:bg-emerald-950/20 p-5 rounded-2xl border border-emerald-200/60 dark:border-emerald-900/40">
              <span className="font-bold text-emerald-800 dark:text-emerald-300 block text-sm">
                Immediate Field Action:
              </span>
              <p className="leading-relaxed">
                {scan.treatment && scan.treatment[0]}
              </p>
              <p className="text-xs text-stone-500 dark:text-stone-400 italic">
                *Sanitize shears and wash hands thoroughly after handling diseased foliage.
              </p>
            </div>
          )}

          {activeTab === 'treatment' && (
            <ul className="space-y-3">
              {scan.treatment && scan.treatment.slice(1).map((item, idx) => (
                <li key={idx} className="flex items-start gap-3 bg-stone-50 dark:bg-darkbg-input p-3.5 rounded-xl border border-stone-200 dark:border-darkbg-border">
                  <CheckCircle2 className="w-4 h-4 text-agri-600 shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          )}

          {activeTab === 'prevention' && (
            <ul className="space-y-3">
              {scan.prevention && scan.prevention.map((item, idx) => (
                <li key={idx} className="flex items-start gap-3 bg-stone-50 dark:bg-darkbg-input p-3.5 rounded-xl border border-stone-200 dark:border-darkbg-border">
                  <Leaf className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          )}

          {activeTab === 'monitoring' && (
            <div className="bg-stone-50 dark:bg-darkbg-input p-5 rounded-2xl border border-stone-200 dark:border-darkbg-border space-y-2">
              <span className="font-bold text-stone-900 dark:text-stone-100 block text-sm">
                Follow-up & Recovery Monitoring:
              </span>
              <p>{scan.monitoring || 'Inspect plot leaves every 3 days. Re-scan on AgriSense after 5 days to verify disease containment.'}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
