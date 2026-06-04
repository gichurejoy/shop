'use client';


import Link from 'next/link';
import dynamic from 'next/dynamic';

const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

import { useState, useEffect, useRef } from 'react';
import { getCmsPages } from '../../actions';

const getCountryName = (id: string): string => {
  if (!id) return '';
  const mapping: Record<string, string> = {
    usa: 'United States',
    drc: 'Democratic Republic of the Congo',
    car: 'Central African Republic',
    uae: 'United Arab Emirates',
    uk: 'United Kingdom',
    britain: 'United Kingdom',
  };
  if (mapping[id.toLowerCase()]) {
    return mapping[id.toLowerCase()];
  }
  // Title case the ID
  return id
    .replace(/[-_]+/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase());
};

export default function AdminDashboard() {
  const [mounted, setMounted] = useState(false);
  
  // Performance chart range state
  const [performanceRange, setPerformanceRange] = useState<'ALL' | '1M' | '6M' | '1Y'>('1Y');

  // Conversions widget state
  const [conversionGroup, setConversionGroup] = useState<'returning' | 'new' | 'referrals'>('returning');
  const [showConversionsModal, setShowConversionsModal] = useState(false);
  const [animatedPercent, setAnimatedPercent] = useState(0);

  // Sessions by country state
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [hoveredCountry, setHoveredCountry] = useState<string | null>(null);
  const [zoom, setZoom] = useState({ scale: 1, originX: 50, originY: 50 });
  const [svgContent, setSvgContent] = useState<string>('');
  const [activeCountryCoords, setActiveCountryCoords] = useState<{ top: string; left?: string; right?: string } | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);

  // Top storefront pages state
  const [topPages, setTopPages] = useState<Array<{ path: string; title: string; views: number; exitRate: string; isSuccess: boolean | 'warning' }>>([]);

  const countries = [
    { name: 'Canada', top: '29%', left: '27%' },
    { name: 'United States', top: '37%', left: '32%'},
    { name: 'Brazil', top: '60%', left: '40%' },
    { name: 'Russia', top: '20%', left: '72%' },
    { name: 'China', top: '32%', left: '76%' },
  ] as const;

  // Performance range mock data
  const performanceData = {
    '1M': {
      labels: ['01 Jun', '04 Jun', '07 Jun', '10 Jun', '13 Jun', '16 Jun', '19 Jun', '22 Jun', '25 Jun', '28 Jun'],
      views: [45, 52, 38, 64, 58, 42, 55, 68, 72, 60],
      clicks: [12, 18, 9, 22, 15, 11, 24, 19, 28, 14],
      maxVal: 80
    },
    '6M': {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      views: [35, 65, 45, 68, 48, 60],
      clicks: [8, 12, 7, 17, 21, 11],
      maxVal: 80
    },
    '1Y': {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      views: [35, 65, 45, 68, 48, 60, 42, 44, 78, 52, 62, 66],
      clicks: [8, 12, 7, 17, 21, 11, 5, 9, 7, 28, 12, 34],
      maxVal: 80
    },
    'ALL': {
      labels: ['2024', '2025', '2026'],
      views: [540, 680, 720],
      clicks: [110, 190, 240],
      maxVal: 800
    }
  };

  // Conversions mock data
  const conversionData = {
    returning: {
      percentage: 65.2,
      label: 'Returning Customer',
      thisWeek: '23.5k',
      lastWeek: '41.05k',
      details: {
        totalCustomers: 124500,
        averageOrderValue: '$84.50',
        repeatRate: '65.2%',
        revenueContribution: '$1.05M',
        monthlyTrend: [60.1, 61.5, 63.0, 64.2, 65.2],
      }
    },
    new: {
      percentage: 24.8,
      label: 'New Customer',
      thisWeek: '8.9k',
      lastWeek: '15.6k',
      details: {
        totalCustomers: 45200,
        averageOrderValue: '$98.20',
        repeatRate: '12.4%',
        revenueContribution: '$443.8k',
        monthlyTrend: [22.0, 23.4, 24.0, 24.5, 24.8],
      }
    },
    referrals: {
      percentage: 10.0,
      label: 'Referral Traffic',
      thisWeek: '3.6k',
      lastWeek: '6.3k',
      details: {
        totalCustomers: 18900,
        averageOrderValue: '$76.10',
        repeatRate: '8.7%',
        revenueContribution: '$143.8k',
        monthlyTrend: [9.5, 9.7, 9.8, 9.9, 10.0],
      }
    }
  };

  // Sessions by country mock data
  const countryData = {
    Canada: { sessions: '3.1k', bounceRate: '41.2%', trend: '+4.5%', isUp: true, thisWeek: '3.1k', lastWeek: '2.8k' },
    'United States': { sessions: '8.2k', bounceRate: '38.5%', trend: '+8.2%', isUp: true, thisWeek: '8.2k', lastWeek: '7.5k' },
    Brazil: { sessions: '2.8k', bounceRate: '49.0%', trend: '-1.2%', isUp: false, thisWeek: '2.8k', lastWeek: '3.1k' },
    Russia: { sessions: '4.5k', bounceRate: '45.1%', trend: '+2.4%', isUp: true, thisWeek: '4.5k', lastWeek: '4.1k' },
    China: { sessions: '4.9k', bounceRate: '35.4%', trend: '+6.1%', isUp: true, thisWeek: '4.9k', lastWeek: '4.5k' },
  };

  const getCountryStats = (name: string) => {
    if (countryData[name as keyof typeof countryData]) {
      return countryData[name as keyof typeof countryData];
    }
    
    // Generate stable mock data based on name
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    const sessionsVal = Math.abs(hash % 40) + 5; // e.g. 0.5k to 4.5k
    const sessions = `${(sessionsVal / 10).toFixed(1)}k`;
    const lastWeekVal = Math.max(sessionsVal + (hash % 6), 3);
    const lastWeek = `${(lastWeekVal / 10).toFixed(1)}k`;
    const bounceVal = 30 + Math.abs(hash % 30);
    const bounceRate = `${bounceVal.toFixed(1)}%`;
    const trendPercent = (hash % 15);
    const trend = `${trendPercent >= 0 ? '+' : ''}${trendPercent}%`;
    const isUp = trendPercent >= 0;

    return {
      sessions,
      bounceRate,
      trend,
      isUp,
      thisWeek: sessions,
      lastWeek
    };
  };

  const handleMapClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as SVGElement;
    if (target && target.tagName === 'path') {
      const id = target.getAttribute('id');
      if (id) {
        const countryName = getCountryName(id);
        if (countryName) {
          setSelectedCountry(selectedCountry === countryName ? null : countryName);
        }
      }
    }
  };

  const currentConversion = conversionData[conversionGroup];
  const currentPerfData = performanceData[performanceRange];

  // SVG Gauge dimensions
  const maxLen = 212; // 270-degree arc length for r=45
  const targetPercent = currentConversion.percentage;

  // Conversions gauge animation
  useEffect(() => {
    let start = animatedPercent;
    const end = targetPercent;
    const duration = 400; // ms
    const startTime = performance.now();

    let animationFrame: number;
    const animate = (time: number) => {
      const elapsed = time - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const ease = progress * (2 - progress); // Ease out quad
      const current = start + (end - start) * ease;
      setAnimatedPercent(current);

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };
    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [conversionGroup, targetPercent]);

  // Load real storefront pages dynamically
  useEffect(() => {
    setMounted(true);

    const loadPages = async () => {
      try {
        const pages = await getCmsPages();
        const list = [
          { path: '/', title: 'Home Page', views: 5240, exitRate: '2.1%', isSuccess: true },
          ...pages.map((p, i) => {
            const mockViews = [1420, 895, 650, 480, 310][i % 5] || 250;
            const mockExitRates = ['4.8%', '12.4%', '8.2%', '15.1%', '22.0%'][i % 5] || '10.5%';
            const status: any = i % 3 === 0 ? true : (i % 3 === 1 ? 'warning' : false);
            return {
              path: `/${p.slug}`,
              title: p.title,
              views: mockViews,
              exitRate: mockExitRates,
              isSuccess: status
            };
          }),
          { path: '/products', title: 'Products Collection', views: 3120, exitRate: '5.6%', isSuccess: true },
          { path: '/cart', title: 'Shopping Cart', views: 1850, exitRate: '14.2%', isSuccess: 'warning' },
          { path: '/blog', title: 'Blog Page', views: 980, exitRate: '28.4%', isSuccess: false },
        ];
        setTopPages(list);
      } catch (err) {
        setTopPages([
          { path: '/', title: 'Home Page', views: 5240, exitRate: '2.1%', isSuccess: true },
          { path: '/products', title: 'Products Collection', views: 3120, exitRate: '5.6%', isSuccess: true },
          { path: '/about', title: 'About Us', views: 1420, exitRate: '4.8%', isSuccess: true },
          { path: '/cart', title: 'Shopping Cart', views: 1850, exitRate: '14.2%', isSuccess: 'warning' },
          { path: '/blog', title: 'Blog Page', views: 980, exitRate: '28.4%', isSuccess: false },
        ]);
      }
    };
    loadPages();
  }, []);

  // Fetch and parse world-map.svg inline so we can interact with country paths
  useEffect(() => {
    fetch('/assets/images/world-map.svg')
      .then(res => res.text())
      .then(text => {
        let adjusted = text.replace(/<svg[^>]*>/, () => {
          return '<svg id="svg2" version="1.2" viewBox="0 0 950 620" class="w-100 h-100" style="display: block;">';
        });
        
        const styles = `
          <style>
            #svg2 path {
              fill: #cbd5e1;
              stroke: #ffffff;
              stroke-width: 0.8;
              transition: all 0.25s ease;
              cursor: pointer;
            }
            #svg2 path:hover {
              fill: #94a3b8;
            }
            #svg2 .selected-country {
              fill: #ff6c2f !important;
            }
          </style>
        `;
        adjusted = adjusted.replace('</defs>', `</defs>${styles}`);
        setSvgContent(adjusted);
      })
      .catch(() => {});
  }, []);

  // Update country selection style classes and dynamic centering zoom coordinates
  useEffect(() => {
    if (!svgContent) return;
    
    const paths = document.querySelectorAll('#svg2 path');
    paths.forEach(p => {
      p.classList.remove('selected-country');
    });

    if (selectedCountry) {
      const match = Array.from(paths).find(p => {
        const id = p.getAttribute('id');
        return id && getCountryName(id).toLowerCase() === selectedCountry.toLowerCase();
      });
      if (match) {
        match.classList.add('selected-country');
        
        try {
          const rect = (match as any).getBBox();
          if (rect) {
            const x = ((rect.x + rect.width / 2) / 950) * 100;
            const y = ((rect.y + rect.height / 2) / 620) * 100;
            
            setActiveCountryCoords({
              top: `${y}%`,
              left: `${x}%`
            });
            setZoom({ scale: 2.2, originX: x, originY: y });
            return;
          }
        } catch (e) {
          // BBox fallback
        }
      }
      
      // Coordinate fallback for static pins
      const predefined = countries.find(c => c.name.toLowerCase() === selectedCountry.toLowerCase());
      if (predefined) {
        setActiveCountryCoords(predefined);
        const x = parseFloat(predefined.left);
        const y = parseFloat(predefined.top);
        setZoom({ scale: 2.2, originX: x, originY: y });
      } else {
        setActiveCountryCoords(null);
      }
    } else {
      setActiveCountryCoords(null);
      setZoom({ scale: 1, originX: 50, originY: 50 });
    }
  }, [selectedCountry, svgContent]);

  const filledLen = maxLen * (animatedPercent / 100);

  return (
    <>
      <div className="row mb-4">
      <div className="col-xxl-5">
        <div className="row">
          <div className="col-12">
            <div className="alert alert-primary text-truncate mb-3" role="alert">
              We regret to inform you that our server is currently experiencing technical difficulties.
            </div>
          </div>

          <div className="col-md-6">
            <div className="card">
              <div className="card-body">
                <div className="d-flex align-items-center justify-content-between">
                  <div>
                    <h4 className="card-title mb-2">Total Orders</h4>
                    <p className="text-muted fw-medium fs-22 mb-0">13, 647</p>
                  </div>
                  <div>
                    <div className="avatar-md bg-soft-primary rounded">
                      <iconify-icon icon="solar:cart-5-bold-duotone" class="avatar-title fs-32 text-primary"></iconify-icon>
                    </div>
                  </div>
                </div>
              </div>
              <div className="card-footer py-2 bg-light bg-opacity-50">
                <div className="d-flex align-items-center justify-content-between">
                  <div>
                    <span className="text-success"> <i className="bx bxs-up-arrow fs-12"></i> 2.3%</span>
                    <span className="text-muted ms-1 fs-12">Last Week</span>
                  </div>
                  <a href="#!" className="text-reset fw-semibold fs-12">View More</a>
                </div>
              </div>
            </div>
          </div>

          <div className="col-md-6">
            <div className="card">
              <div className="card-body">
                <div className="d-flex align-items-center justify-content-between">
                  <div>
                    <h4 className="card-title mb-2">New Leads</h4>
                    <p className="text-muted fw-medium fs-22 mb-0">9, 526</p>
                  </div>
                  <div>
                    <div className="avatar-md bg-soft-primary rounded">
                      <iconify-icon icon="solar:users-group-two-rounded-bold-duotone" class="avatar-title fs-32 text-primary"></iconify-icon>
                    </div>
                  </div>
                </div>
              </div>
              <div className="card-footer py-2 bg-light bg-opacity-50">
                <div className="d-flex align-items-center justify-content-between">
                  <div>
                    <span className="text-success"> <i className="bx bxs-up-arrow fs-12"></i> 8.1%</span>
                    <span className="text-muted ms-1 fs-12">Last Month</span>
                  </div>
                  <a href="#!" className="text-reset fw-semibold fs-12">View More</a>
                </div>
              </div>
            </div>
          </div>

          <div className="col-md-6">
            <div className="card">
              <div className="card-body">
                <div className="d-flex align-items-center justify-content-between">
                  <div>
                    <h4 className="card-title mb-2">Deals</h4>
                    <p className="text-muted fw-medium fs-22 mb-0">976</p>
                  </div>
                  <div>
                    <div className="avatar-md bg-soft-primary rounded">
                      <iconify-icon icon="solar:backpack-bold-duotone" class="avatar-title fs-32 text-primary"></iconify-icon>
                    </div>
                  </div>
                </div>
              </div>
              <div className="card-footer py-2 bg-light bg-opacity-50">
                <div className="d-flex align-items-center justify-content-between">
                  <div>
                    <span className="text-danger"> <i className="bx bxs-down-arrow fs-12"></i> 0.3%</span>
                    <span className="text-muted ms-1 fs-12">Last Month</span>
                  </div>
                  <a href="#!" className="text-reset fw-semibold fs-12">View More</a>
                </div>
              </div>
            </div>
          </div>

          <div className="col-md-6">
            <div className="card">
              <div className="card-body">
                <div className="d-flex align-items-center justify-content-between">
                  <div>
                    <h4 className="card-title mb-2">Booked Revenue</h4>
                    <p className="text-muted fw-medium fs-22 mb-0">$123.6k</p>
                  </div>
                  <div>
                    <div className="avatar-md bg-soft-primary rounded">
                      <iconify-icon icon="solar:wallet-money-bold-duotone" class="avatar-title fs-32 text-primary"></iconify-icon>
                    </div>
                  </div>
                </div>
              </div>
              <div className="card-footer py-2 bg-light bg-opacity-50">
                <div className="d-flex align-items-center justify-content-between">
                  <div>
                    <span className="text-danger"> <i className="bx bxs-down-arrow fs-12"></i> 10.6%</span>
                    <span className="text-muted ms-1 fs-12">Last Month</span>
                  </div>
                  <a href="#!" className="text-reset fw-semibold fs-12">View More</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="col-xxl-7">
        <div className="card">
          <div className="card-body">
            <div className="d-flex justify-content-between align-items-center">
              <h4 className="card-title">Performance</h4>
              <div>
                {(['ALL', '1M', '6M', '1Y'] as const).map((range) => (
                  <button 
                    key={range}
                    type="button" 
                    onClick={() => setPerformanceRange(range)}
                    className={`btn btn-sm me-1 ${performanceRange === range ? 'btn-primary' : 'btn-outline-light'}`}
                  >
                    {range}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-4" style={{ height: '320px', width: '100%' }}>
              {mounted && <ReactApexChart 
                key={performanceRange}
                options={{
                  chart: {
                    type: 'line',
                    toolbar: { show: false },
                    fontFamily: 'inherit',
                    parentHeightOffset: 0,
                    animations: { enabled: false }
                  },
                  stroke: {
                    width: [0, 3],
                    curve: 'smooth'
                  },
                  colors: ['#ff6c2f', '#10b981'],
                  fill: {
                    type: ['gradient', 'gradient'],
                    gradient: {
                      shade: 'light',
                      type: "vertical",
                      opacityFrom: [0.85, 0.6],
                      opacityTo: [0.3, 0.05],
                      stops: [0, 100]
                    }
                  },
                  plotOptions: {
                    bar: {
                      columnWidth: '35%',
                      borderRadius: 4,
                      borderRadiusApplication: 'end',
                    }
                  },
                  dataLabels: {
                    enabled: false
                  },
                  labels: currentPerfData.labels,
                  xaxis: {
                    axisBorder: { show: false },
                    axisTicks: { show: false },
                    labels: { style: { colors: '#64748b', fontSize: '12px' } }
                  },
                  yaxis: {
                    min: 0,
                    max: currentPerfData.maxVal,
                    tickAmount: 4,
                    labels: {
                      style: { colors: '#64748b', fontSize: '12px' },
                      formatter: (value) => {
                        if (performanceRange === 'ALL') return `${value}`;
                        return `${value}k`;
                      }
                    }
                  },
                  grid: {
                    borderColor: '#f1f5f9',
                    strokeDashArray: 4,
                    padding: { top: 10, bottom: 0, right: 10, left: 10 }
                  },
                  legend: {
                    position: 'top',
                    horizontalAlign: 'right',
                    offsetY: -10,
                    markers: { strokeWidth: 0, size: 6, radius: 12 },
                    itemMargin: { horizontal: 10, vertical: 0 }
                  },
                  tooltip: {
                    shared: true,
                    intersect: false,
                    y: {
                      formatter: (y) => {
                        if (typeof y !== "undefined") {
                          if (performanceRange === 'ALL') return y.toFixed(0);
                          return y.toFixed(0) + "k";
                        }
                        return y;
                      }
                    }
                  }
                }} 
                series={[
                  {
                    name: 'Page Views',
                    type: 'column',
                    data: currentPerfData.views
                  },
                  {
                    name: 'Clicks',
                    type: 'area',
                    data: currentPerfData.clicks
                  }
                ]}
                type="line"
                height="100%"
                width="100%"
              />}
            </div>
          </div>
        </div>
      </div>
    </div>

      <div className="row mb-4">
        <div className="col-lg-4">
          <div className="card">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="card-title mb-0">Conversions</h5>
                <select 
                  value={conversionGroup} 
                  onChange={(e) => setConversionGroup(e.target.value as any)}
                  className="form-select form-select-sm border-0 bg-light bg-opacity-75 text-dark fw-semibold"
                  style={{ width: '160px', cursor: 'pointer', fontSize: '12px', paddingRight: '24px' }}
                >
                  <option value="returning">Returning Customers</option>
                  <option value="new">New Customers</option>
                  <option value="referrals">Referral Traffic</option>
                </select>
              </div>

              <div className="mb-2 mt-n2 d-flex justify-content-center align-items-center" style={{ height: '235px' }}>
                <div className="position-relative w-100 h-100 d-flex flex-column align-items-center justify-content-center">
                  <svg viewBox="0 0 100 100" className="w-100" style={{ maxWidth: '200px' }}>
                    <mask id="arc-mask">
                      <path 
                        d="M 18 82 A 45 45 0 1 1 82 82" 
                        fill="none" 
                        stroke="white" 
                        strokeWidth="16" 
                        strokeLinecap="butt" 
                        strokeDasharray={`${filledLen} 1000`} 
                        style={{ transition: 'stroke-dasharray 0.4s ease-out' }}
                      />
                    </mask>
                    <path d="M 18 82 A 45 45 0 1 1 82 82" fill="none" stroke="#f1f5f9" strokeWidth="12" strokeLinecap="butt" />
                    <path d="M 18 82 A 45 45 0 1 1 82 82" fill="none" stroke="#ff6c2f" strokeWidth="12" strokeDasharray="2 4" strokeLinecap="butt" mask="url(#arc-mask)" />
                  </svg>
                  <div className="position-absolute d-flex flex-column align-items-center" style={{ top: '62%' }}>
                    <span className="fs-24 fw-semibold text-dark">{animatedPercent.toFixed(1)}%</span>
                    <span className="text-muted text-center" style={{ fontSize: '12px', maxWidth: '120px', lineHeight: '1.2' }}>{currentConversion.label}</span>
                  </div>
                </div>
              </div>
              <div className="row text-center mt-3">
                <div className="col-6">
                  <p className="text-muted mb-2">This Week</p>
                  <h3 className="text-dark mb-3">{currentConversion.thisWeek}</h3>
                </div>
                <div className="col-6">
                  <p className="text-muted mb-2">Last Week</p>
                  <h3 className="text-dark mb-3">{currentConversion.lastWeek}</h3>
                </div>
              </div>
              <div className="text-center">
                <button 
                  type="button" 
                  onClick={() => setShowConversionsModal(true)}
                  className="btn bg-light bg-opacity-50 text-dark border-0 shadow-none w-100 py-2 fw-semibold"
                  style={{ transition: 'all 0.2s ease' }}
                >
                  View Details
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-4">
          <div className="card">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="card-title mb-0">Sessions by Country</h5>
                {(selectedCountry || zoom.scale > 1) && (
                  <button 
                    type="button" 
                    onClick={() => { setSelectedCountry(null); setZoom({ scale: 1, originX: 50, originY: 50 }); }}
                    className="btn btn-sm btn-link text-decoration-none p-0 fs-12 text-primary fw-medium"
                  >
                    Reset Zoom & Filter
                  </button>
                )}
              </div>

              <div 
                ref={mapContainerRef}
                onClick={handleMapClick}
                className="position-relative rounded overflow-hidden" 
                style={{ height: '316px', border: '1px solid #f1f5f9' }}
              >
                {svgContent ? (
                  <div 
                    className="w-100 h-100 position-relative bg-light bg-opacity-10" 
                    style={{ 
                      transform: `scale(${zoom.scale})`,
                      transformOrigin: `${zoom.originX}% ${zoom.originY}%`,
                      transition: 'transform 0.45s cubic-bezier(0.25, 0.8, 0.25, 1), transform-origin 0.45s cubic-bezier(0.25, 0.8, 0.25, 1)'
                    }}
                    dangerouslySetInnerHTML={{ __html: svgContent }}
                  />
                ) : (
                  <div 
                    className="w-100 h-100 position-relative bg-light bg-opacity-10" 
                    style={{ 
                      backgroundImage: 'url("/assets/images/world-map.svg")', 
                      backgroundSize: 'contain', 
                      backgroundRepeat: 'no-repeat', 
                      backgroundPosition: 'center', 
                      opacity: 0.9,
                      transform: `scale(${zoom.scale})`,
                      transformOrigin: `${zoom.originX}% ${zoom.originY}%`,
                      transition: 'transform 0.45s cubic-bezier(0.25, 0.8, 0.25, 1), transform-origin 0.45s cubic-bezier(0.25, 0.8, 0.25, 1)'
                    }}
                  />
                )}

                {/* Overlaid components inside the zoomable container boundaries */}
                <div 
                  className="position-absolute top-0 start-0 w-100 h-100"
                  style={{
                    transform: `scale(${zoom.scale})`,
                    transformOrigin: `${zoom.originX}% ${zoom.originY}%`,
                    transition: 'transform 0.45s cubic-bezier(0.25, 0.8, 0.25, 1), transform-origin 0.45s cubic-bezier(0.25, 0.8, 0.25, 1)',
                    pointerEvents: 'none'
                  }}
                >
                  {/* Dynamic selection tooltip overlay */}
                  {selectedCountry && activeCountryCoords && (
                    (() => {
                      const data = getCountryStats(selectedCountry);
                      const topPercent = parseFloat(activeCountryCoords.top);

                      return (
                        <div 
                          className="position-absolute" 
                          style={{ 
                            top: activeCountryCoords.top, 
                            left: 'left' in activeCountryCoords ? activeCountryCoords.left : undefined, 
                            right: 'right' in activeCountryCoords ? activeCountryCoords.right : undefined,
                            zIndex: 1000,
                            transform: `translate(-50%, -50%) scale(${1 / zoom.scale})`,
                            transformOrigin: 'center center',
                            pointerEvents: 'auto'
                          }}
                        >
                          <div 
                            className="position-absolute shadow-lg rounded p-2 text-start" 
                            style={{
                              top: topPercent < 45 ? '100%' : undefined,
                              bottom: topPercent >= 45 ? '100%' : undefined,
                              left: '50%',
                              transform: `translateX(-50%) ${topPercent < 45 ? 'translateY(12px)' : 'translateY(-12px)'}`,
                              transformOrigin: topPercent < 45 ? 'top center' : 'bottom center',
                              backgroundColor: '#0f172a',
                              color: '#fff',
                              fontSize: '10px',
                              width: '130px',
                              pointerEvents: 'none',
                              border: '1.5px solid #ff6c2f',
                              boxShadow: '0 10px 15px -3px rgba(0,0,0,0.3)'
                            }}
                          >
                            <div className="fw-bold border-bottom border-secondary pb-1 mb-1" style={{ fontSize: '11px' }}>{selectedCountry}</div>
                            <div className="d-flex justify-content-between mb-1">
                              <span className="text-secondary">Sessions:</span>
                              <span className="fw-semibold">{data.sessions}</span>
                            </div>
                            <div className="d-flex justify-content-between mb-1">
                              <span className="text-secondary">Bounce:</span>
                              <span className="fw-semibold">{data.bounceRate}</span>
                            </div>
                            <div className="d-flex justify-content-between">
                              <span className="text-secondary">Trend:</span>
                              <span className={data.isUp ? 'text-success fw-bold' : 'text-danger fw-bold'}>
                                {data.trend}
                              </span>
                            </div>
                            <div style={{
                              position: 'absolute',
                              top: topPercent < 45 ? 'auto' : '100%',
                              bottom: topPercent < 45 ? '100%' : 'auto',
                              left: '50%',
                              transform: 'translateX(-50%)',
                              width: 0,
                              height: 0,
                              borderLeft: '5px solid transparent',
                              borderRight: '5px solid transparent',
                              borderTop: topPercent < 45 ? 'none' : '5px solid #0f172a',
                              borderBottom: topPercent < 45 ? '5px solid #0f172a' : 'none'
                            }} />
                          </div>
                        </div>
                      );
                    })()
                  )}

                  {/* Standard Country Pulse Beacon Pins */}
                  {countries.map((c) => {
                    const isSelected = selectedCountry === c.name;
                    if (isSelected) return null; // Avoid duplicate tooltip rendering

                    const isHovered = hoveredCountry === c.name;
                    const data = getCountryStats(c.name);
                    const pinColor = '#64748b';
                    const pulseClass = 'pulse-gray';

                    return (
                      <div 
                        key={c.name}
                        className="position-absolute" 
                        style={{ 
                          top: c.top, 
                          left: c.left,
                          zIndex: isHovered ? 100 : 10,
                          transform: `translate(-50%, -50%) scale(${1 / zoom.scale})`,
                          transformOrigin: 'center center',
                          pointerEvents: 'auto'
                        }}
                        onMouseEnter={() => setHoveredCountry(c.name)}
                        onMouseLeave={() => setHoveredCountry(null)}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedCountry(selectedCountry === c.name ? null : c.name);
                        }}
                      >
                        <div 
                          className="d-flex align-items-center gap-1 cursor-pointer" 
                          style={{ 
                            transition: 'transform 0.2s ease',
                            padding: '4px'
                          }}
                        >
                          <div 
                            className={`rounded-circle d-flex justify-content-center align-items-center ${pulseClass}`} 
                            style={{ 
                              width: '18px', 
                              height: '18px', 
                              backgroundColor: 'rgba(100, 116, 139, 0.2)',
                              transition: 'all 0.2s ease'
                            }}
                          >
                            <div className="rounded-circle" style={{ width: '8px', height: '8px', backgroundColor: pinColor }}></div>
                          </div>
                          <span className="fw-semibold text-dark px-1 bg-white bg-opacity-75 rounded" style={{ fontSize: '11px', whiteSpace: 'nowrap', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                            {c.name}
                          </span>
                        </div>

                        {/* Hover Tooltip */}
                        {isHovered && (
                          <div 
                            className="position-absolute shadow-lg rounded p-2 text-start" 
                            style={{
                              top: parseFloat(c.top) < 45 ? '100%' : undefined,
                              bottom: parseFloat(c.top) >= 45 ? '100%' : undefined,
                              left: '50%',
                              transform: `translateX(-50%) ${parseFloat(c.top) < 45 ? 'translateY(12px)' : 'translateY(-12px)'}`,
                              transformOrigin: parseFloat(c.top) < 45 ? 'top center' : 'bottom center',
                              backgroundColor: '#0f172a',
                              color: '#fff',
                              fontSize: '10px',
                              width: '130px',
                              zIndex: 1000,
                              pointerEvents: 'none',
                              border: '1px solid #334155',
                              boxShadow: '0 10px 15px -3px rgba(0,0,0,0.3)'
                            }}
                          >
                            <div className="fw-bold border-bottom border-secondary pb-1 mb-1" style={{ fontSize: '11px' }}>{c.name}</div>
                            <div className="d-flex justify-content-between mb-1">
                              <span className="text-secondary">Sessions:</span>
                              <span className="fw-semibold">{data.sessions}</span>
                            </div>
                            <div className="d-flex justify-content-between mb-1">
                              <span className="text-secondary">Bounce:</span>
                              <span className="fw-semibold">{data.bounceRate}</span>
                            </div>
                            <div className="d-flex justify-content-between">
                              <span className="text-secondary">Trend:</span>
                              <span className={data.isUp ? 'text-success fw-bold' : 'text-danger fw-bold'}>
                                {data.trend}
                              </span>
                            </div>
                            <div style={{
                              position: 'absolute',
                              top: parseFloat(c.top) < 45 ? 'auto' : '100%',
                              bottom: parseFloat(c.top) < 45 ? '100%' : 'auto',
                              left: '50%',
                              transform: 'translateX(-50%)',
                              width: 0,
                              height: 0,
                              borderLeft: '5px solid transparent',
                              borderRight: '5px solid transparent',
                              borderTop: parseFloat(c.top) < 45 ? 'none' : '5px solid #0f172a',
                              borderBottom: parseFloat(c.top) < 45 ? '5px solid #0f172a' : 'none'
                            }} />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Floating Map Zoom Controls */}
                <div className="position-absolute d-flex flex-column gap-1 bg-white p-1 rounded shadow border" style={{ bottom: '12px', right: '12px', zIndex: 110 }}>
                  <button 
                    type="button" 
                    onClick={(e) => {
                      e.stopPropagation();
                      setZoom(z => ({ ...z, scale: Math.min(z.scale + 0.4, 4) }));
                    }}
                    className="btn btn-sm btn-light p-0 d-flex align-items-center justify-content-center border-0"
                    style={{ width: '26px', height: '26px' }}
                    title="Zoom In"
                  >
                    <iconify-icon icon="solar:magnifer-zoom-in-bold" class="fs-16 text-dark"></iconify-icon>
                  </button>
                  <button 
                    type="button" 
                    onClick={(e) => {
                      e.stopPropagation();
                      setZoom(z => {
                        const newScale = Math.max(z.scale - 0.4, 1);
                        return {
                          scale: newScale,
                          originX: newScale <= 1 ? 50 : z.originX,
                          originY: newScale <= 1 ? 50 : z.originY
                        };
                      });
                    }}
                    className="btn btn-sm btn-light p-0 d-flex align-items-center justify-content-center border-0"
                    style={{ width: '26px', height: '26px' }}
                    title="Zoom Out"
                  >
                    <iconify-icon icon="solar:magnifer-zoom-out-bold" class="fs-16 text-dark"></iconify-icon>
                  </button>
                  <button 
                    type="button" 
                    onClick={(e) => {
                      e.stopPropagation();
                      setZoom({ scale: 1, originX: 50, originY: 50 });
                      setSelectedCountry(null);
                    }}
                    className="btn btn-sm btn-light p-0 d-flex align-items-center justify-content-center border-0"
                    style={{ width: '26px', height: '26px' }}
                    title="Reset Zoom"
                  >
                    <iconify-icon icon="solar:restart-bold" class="fs-16 text-dark"></iconify-icon>
                  </button>
                </div>
              </div>

              <div className="row text-center mt-3">
                <div className="col-6">
                  <p className="text-muted mb-2">This Week {selectedCountry && `(${selectedCountry})`}</p>
                  <h3 className="text-dark mb-3">{selectedCountry ? getCountryStats(selectedCountry).thisWeek : '23.5k'}</h3>
                </div>
                <div className="col-6">
                  <p className="text-muted mb-2">Last Week {selectedCountry && `(${selectedCountry})`}</p>
                  <h3 className="text-dark mb-3">{selectedCountry ? getCountryStats(selectedCountry).lastWeek : '41.05k'}</h3>
                </div>
              </div>

              {selectedCountry && (() => {
                const stats = getCountryStats(selectedCountry);
                return (
                  <div className="mt-1 p-2 bg-light bg-opacity-75 rounded text-center border border-dashed border-secondary border-opacity-25" style={{ transition: 'all 0.3s ease' }}>
                    <span className="text-muted fs-11 me-3">Bounce Rate: <strong className="text-dark">{stats.bounceRate}</strong></span>
                    <span className="text-muted fs-11">Trend: <strong className={stats.isUp ? 'text-success' : 'text-danger'}>{stats.trend}</strong></span>
                  </div>
                );
              })()}
            </div>
          </div>
        </div>

        <div className="col-lg-4">
          <div className="card card-height-100">
            <div className="card-header d-flex align-items-center justify-content-between gap-2">
              <h4 className="card-title flex-grow-1">Top Pages</h4>
              <Link href="/admin/cms/pages" className="btn btn-sm btn-soft-primary">Manage Pages</Link>
            </div>
            <div className="table-responsive" style={{ maxHeight: '316px', overflowY: 'auto' }}>
              <table className="table table-hover table-nowrap table-centered m-0">
                <thead className="bg-light bg-opacity-50">
                  <tr>
                    <th className="text-muted ps-3">Page Path</th>
                    <th className="text-muted">Views</th>
                    <th className="text-muted">Exit Rate</th>
                  </tr>
                </thead>
                <tbody>
                  {topPages.length > 0 ? (
                    topPages.map((page, i) => (
                      <tr key={i}>
                        <td className="ps-3">
                          <Link href={page.path} target="_blank" className="text-muted d-block text-truncate" style={{ maxWidth: '170px' }} title={`${page.title} (${page.path})`}>
                            <span className="text-dark fw-medium">{page.path}</span>
                            <span className="text-muted d-block fs-11">{page.title}</span>
                          </Link>
                        </td>
                        <td>{page.views.toLocaleString()}</td>
                        <td>
                          <span className={`badge ${
                            page.isSuccess === true ? 'bg-success-subtle text-success' : 
                            page.isSuccess === 'warning' ? 'bg-warning-subtle text-warning' : 
                            'bg-danger-subtle text-danger'
                          }`}>
                            {page.exitRate}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={3} className="text-center py-4 text-muted fs-12">Loading pages...</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Conversions Detailed Modal */}
      {showConversionsModal && (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1050 }} tabIndex={-1} role="dialog">
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content shadow-lg border-0 rounded-4">
              <div className="modal-header border-0 pb-0">
                <h5 className="modal-title fw-bold text-dark">{currentConversion.label} Analysis</h5>
                <button type="button" className="btn-close" onClick={() => setShowConversionsModal(false)}></button>
              </div>
              <div className="modal-body pt-3">
                <div className="p-3 bg-light rounded mb-3">
                  <div className="row g-2 text-center">
                    <div className="col-6 border-end">
                      <div className="text-muted small">Total Customers</div>
                      <div className="fs-18 fw-bold text-dark">{currentConversion.details.totalCustomers.toLocaleString()}</div>
                    </div>
                    <div className="col-6">
                      <div className="text-muted small">Avg Order Value</div>
                      <div className="fs-18 fw-bold text-dark">{currentConversion.details.averageOrderValue}</div>
                    </div>
                  </div>
                </div>
                <div className="mb-3">
                  <h6 className="fw-semibold text-dark mb-2">Key Metrics</h6>
                  <div className="d-flex justify-content-between py-2 border-bottom">
                    <span className="text-muted">Repeat Purchase Rate</span>
                    <span className="fw-medium text-dark">{currentConversion.details.repeatRate}</span>
                  </div>
                  <div className="d-flex justify-content-between py-2 border-bottom">
                    <span className="text-muted">Revenue Contribution</span>
                    <span className="fw-medium text-dark">{currentConversion.details.revenueContribution}</span>
                  </div>
                </div>
                <div>
                  <h6 className="fw-semibold text-dark mb-2">Monthly Conversion Rate Trend</h6>
                  <div className="d-flex align-items-end gap-2 justify-content-between pt-3 pb-1" style={{ height: '110px' }}>
                    {currentConversion.details.monthlyTrend.map((rate, i) => (
                      <div key={i} className="d-flex flex-column align-items-center flex-grow-1">
                        <div 
                          className="rounded-top w-100" 
                          style={{ 
                            height: `${rate * 1.3}px`, 
                            minHeight: '10px', 
                            backgroundColor: '#ff6c2f',
                            transition: 'height 0.4s ease-out'
                          }} 
                        />
                        <span className="fs-10 text-muted mt-1">{['Jan', 'Feb', 'Mar', 'Apr', 'May'][i]}</span>
                        <span className="fs-11 fw-semibold text-dark">{rate}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="modal-footer border-0">
                <button type="button" className="btn btn-secondary border-0 px-4 py-2 rounded-3 fw-medium" onClick={() => setShowConversionsModal(false)}>Close</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Custom styles for map beacons */}
      <style>{`
        .pulse-gray {
          animation: pulse-gray 2s infinite;
        }
        .pulse-orange {
          animation: pulse-orange 2s infinite;
        }
        @keyframes pulse-gray {
          0% { box-shadow: 0 0 0 0 rgba(100, 116, 139, 0.4); }
          70% { box-shadow: 0 0 0 8px rgba(100, 116, 139, 0); }
          100% { box-shadow: 0 0 0 0 rgba(100, 116, 139, 0); }
        }
        @keyframes pulse-orange {
          0% { box-shadow: 0 0 0 0 rgba(255, 108, 47, 0.6); }
          70% { box-shadow: 0 0 0 10px rgba(255, 108, 47, 0); }
          100% { box-shadow: 0 0 0 0 rgba(255, 108, 47, 0); }
        }
      `}</style>

      <div className="row mb-0">
        <div className="col">
          <div className="card">
          <div className="card-header d-flex justify-content-between align-items-center">
            <h4 className="card-title">Recent Orders</h4>
            <Link href="/admin/orders" className="btn btn-sm btn-soft-primary">View All</Link>
          </div>
          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table align-middle mb-0 table-hover table-centered">
                <thead className="bg-light-subtle">
                  <tr>
                    <th>Order ID</th>
                    <th>Date</th>
                    <th>Product</th>
                    <th>Customer Name</th>
                    <th>Email ID</th>
                    <th>Phone No.</th>
                    <th>Address</th>
                    <th>Payment Type</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { id: '#RB5625', date: '29 April 2024', customer: 'Anna M. Hines', email: 'anna.hines@mail.com', phone: '(+1)-555-1564-261', address: 'Burr Ridge/Illinois', payment: 'Credit Card', status: 'Completed' },
                    { id: '#RB9652', date: '25 April 2024', customer: 'Judith H. Fritsche', email: 'judith.fritsche.com', phone: '(+57)-305-5579-759', address: 'SULLIVAN/Kentucky', payment: 'Credit Card', status: 'Completed' },
                    { id: '#RB5984', date: '25 April 2024', customer: 'Peter T. Smith', email: 'peter.smith@mail.com', phone: '(+33)-655-5187-93', address: 'Yreka/California', payment: 'Pay Pal', status: 'Completed' },
                  ].map((order, i) => (
                    <tr key={i}>
                      <td>{order.id}</td>
                      <td>{order.date}</td>
                      <td><iconify-icon icon="solar:laptop-bold-duotone" class="fs-20"></iconify-icon></td>
                      <td>{order.customer}</td>
                      <td>{order.email}</td>
                      <td>{order.phone}</td>
                      <td>{order.address}</td>
                      <td>{order.payment}</td>
                      <td><span className="badge bg-success-subtle text-success">{order.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        </div>
      </div>
    </>
  );
}
