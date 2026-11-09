import { useEffect, useMemo, useState, type ReactNode } from 'react';

type Role = 'pemesan' | 'petugas';
type Page = 'jadwal' | 'pesan' | 'transaksi' | 'tiket' | 'layani' | 'stasiun' | 'lokomotif' | 'gerbong' | 'kelola-jadwal';
type Status = 'Menunggu Pembayaran' | 'Menunggu Verifikasi' | 'Terverifikasi' | 'Dibatalkan';
type Transaction = {
  id_transaksi: string;
  batas_bayar: Date;
  status: Status;
  tanggal_transaksi: string;
  id_pemesan: string;
  nama_pemesan: string;
  nama_penumpang?: string[];
  id_petugas: string | null;
  verified_at: string | null;
  route: string;
  seats: string[];
  total: number;
  method: string;
  tanggal_perjalanan?: string;
  waktu_berangkat?: string;
  waktu_tiba?: string;
  kode_lokomotif?: string;
};
type JourneySchedule = {
  id_jadwal: string;
  stasiun_asal: string;
  waktu_berangkat: string;
  stasiun_tujuan: string;
  waktu_tiba: string;
  kode_lokomotif: string;
  tanggal: string;
  harga: number;
  stops: string[];
};
type IconName =
  | 'train'
  | 'calendar'
  | 'ticket'
  | 'receipt'
  | 'map'
  | 'menu'
  | 'close'
  | 'arrow'
  | 'clock'
  | 'user'
  | 'logout'
  | 'plus'
  | 'edit'
  | 'trash'
  | 'check'
  | 'seat'
  | 'building'
  | 'engine'
  | 'coach'
  | 'search'
  | 'card'
  | 'print'
  | 'wifi'
  | 'snow'
  | 'tv'
  | 'toilet';

const iconPaths: Record<IconName, ReactNode> = {
  train: <><path d="M4 15V5c0-2 2-3 8-3s8 1 8 3v10a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3Z"/><path d="M4 10h16M8 6h.01M16 6h.01M8 18l-3 4M16 18l3 4M8 14h.01M16 14h.01"/></>,
  calendar: <><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 10h18"/></>,
  ticket: <><path d="M2 9a3 3 0 0 0 0 6v4h20v-4a3 3 0 0 0 0-6V5H2v4Z"/><path d="M13 5v2M13 11v2M13 17v2"/></>,
  receipt: <><path d="M5 3h14v19l-3-2-4 2-4-2-3 2V3Z"/><path d="M9 8h6M9 12h6M9 16h4"/></>,
  map: <><path d="m3 6 5-3 8 3 5-3v15l-5 3-8-3-5 3V6Z"/><path d="M8 3v15M16 6v15"/></>,
  menu: <path d="M4 6h16M4 12h16M4 18h16"/>,
  close: <path d="m6 6 12 12M18 6 6 18"/>,
  arrow: <path d="m9 18 6-6-6-6"/>,
  clock: <><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></>,
  user: <><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/></>,
  logout: <><path d="M10 17l5-5-5-5M15 12H3"/><path d="M15 4h4a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-4"/></>,
  plus: <path d="M12 5v14M5 12h14"/>,
  edit: <><path d="m4 20 4-1 11-11-3-3L5 16l-1 4Z"/><path d="m14 7 3 3"/></>,
  trash: <><path d="M4 7h16M9 7V4h6v3M6 7l1 14h10l1-14M10 11v6M14 11v6"/></>,
  check: <path d="m5 12 4 4L19 6"/>,
  seat: <><path d="M7 12V5a3 3 0 0 1 6 0v7M5 10a2 2 0 0 0-2 2v5h14v-5a2 2 0 0 0-2-2M5 17v4M15 17v4"/></>,
  building: <><path d="M4 21V8l8-5 8 5v13M2 21h20M9 21v-5h6v5M8 10h.01M12 10h.01M16 10h.01"/></>,
  engine: <><path d="M3 16V8h13l4 5v3H3ZM6 8V5h8v3"/><circle cx="7" cy="18" r="2"/><circle cx="17" cy="18" r="2"/></>,
  coach: <><rect x="3" y="4" width="18" height="15" rx="3"/><path d="M3 14h18M8 4v10M16 4v10M7 19l-2 3M17 19l2 3"/></>,
  search: <><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></>,
  card: <><rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20M6 15h4"/></>,
  print: <><path d="M6 9V3h12v6M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><path d="M6 14h12v8H6z"/></>,
  wifi: <><path d="M5 12a11 11 0 0 1 14 0M8 15a7 7 0 0 1 8 0M11 18a2 2 0 0 1 2 0"/><circle cx="12" cy="20" r=".5" fill="currentColor"/></>,
  snow: <><path d="M12 2v20M4 7l16 10M20 7 4 17M9 4l3 3 3-3M9 20l3-3 3 3"/></>,
  tv: <><rect x="3" y="6" width="18" height="14" rx="2"/><path d="m8 2 4 4 4-4"/></>,
  toilet: <><circle cx="8" cy="5" r="2"/><circle cx="16" cy="5" r="2"/><path d="M5 22v-7H3l2-7h6l2 7h-2v7M16 8v14M13 8h6"/></>,
};

function Icon({ name, size = 20, className = '' }: { name: IconName; size?: number; className?: string }) {
  return <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>{iconPaths[name]}</svg>;
}

const locomotiveTypes = ['KAJJ', 'KRL', 'MRT', 'LRT', 'RAILINK'];

const initialTransactions: Transaction[] = [];
const initialStations = [
  'Pasar Senen',
  'Jakarta Timur',
  'Cikarang',
  'Jatibarang',
  'Cirebon',
  'Babakan',
  'Brebes',
  'Gambir',
  'Yogyakarta',
  'Solo Balapan',
  'Surabaya Gubeng',
  'Bandung',
  'Semarang Tawang',
  'Purwokerto',
  'Madiun',
].map((name, index) => [`ST${String(index + 1).padStart(3, '0')}`, name]);
const initialLocomotives = [
  ['Argo Bromo Anggrek', 'KAJJ'],
  ['Argo Lawu', 'KAJJ'],
  ['Argo Dwipangga', 'KAJJ'],
  ['Gajayana', 'KAJJ'],
  ['Taksaka', 'KAJJ'],
  ['Lodaya', 'KAJJ'],
  ['Sancaka', 'KAJJ'],
  ['Fajar Utama', 'KAJJ'],
  ['Commuter Line Bogor', 'KRL'],
  ['Commuter Line Bekasi', 'KRL'],
  ['MRT Jakarta Selatan', 'MRT'],
  ['LRT Jabodebek', 'LRT'],
  ['Railink Soetta', 'RAILINK'],
  ['Kahuripan', 'KAJJ'],
  ['Sri Tanjung', 'KAJJ'],
].map(([name, type], index) => [`CC${String(index + 1).padStart(3, '0')}`, name, type]);

function useStoredState<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(() => {
    try {
      const saved = localStorage.getItem(key);
      return saved === null ? initialValue : JSON.parse(saved) as T;
    } catch (error) {
      console.error(`Gagal membaca data ${key} dari penyimpanan browser.`, error);
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Gagal menyimpan data ${key} ke penyimpanan browser.`, error);
    }
  }, [key, value]);

  return [value, setValue] as const;
}

function scheduleRowsToJourneys(rows: string[][]): JourneySchedule[] {
  return rows.map(row => ({
    id_jadwal: row[0],
    stasiun_asal: row[1],
    waktu_berangkat: row[2],
    stasiun_tujuan: row[3],
    waktu_tiba: row[4],
    kode_lokomotif: row[5],
    tanggal: row[6],
    harga: Number(row[7]),
    stops: [row[1], ...(row[8] ? row[8].split(',').filter(Boolean) : []), row[3]],
  }));
}

function formatDate(value: string) {
  return value ? new Date(`${value}T00:00:00`).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : '';
}

function downloadTicket(t: Transaction) {
  const [origin, destination] = t.route.split(' — ');
  const html = `<!doctype html><html><head><meta charset="utf-8"><title>Tiket ${t.id_transaksi}</title><style>body{font-family:Arial;background:#edf2f7;padding:40px;color:#17233c}.ticket{max-width:850px;margin:auto;background:white;border-radius:18px;overflow:hidden;box-shadow:0 14px 40px #0002;border-top:10px solid #f26b38}.head,.route,.info{display:flex;justify-content:space-between;align-items:center}.head{padding:24px 30px;border-bottom:1px dashed #ccd5e2}.brand{font-size:24px;font-weight:800;color:#092d68}.brand span{color:#f26b38}.pass{font-size:11px;letter-spacing:3px}.route{padding:35px 45px;text-align:center}.station b{display:block;font-size:35px;color:#092d68}.station span{font-size:13px}.line{flex:1;margin:0 40px;color:#f26b38}.line hr{border:0;border-top:2px dashed #9aabc1}.info{background:#f7f9fc;padding:22px 30px}.info div{display:flex;flex-direction:column;gap:5px}.info small{color:#78869a}.foot{padding:18px 30px;text-align:center;font-size:11px;color:#78869a}@media print{body{background:white;padding:0}.ticket{box-shadow:none}}</style></head><body><div class="ticket"><div class="head"><div class="brand">JUGIJAK<span>GIJUK</span></div><div class="pass">BOARDING PASS</div></div><div class="route"><div class="station"><b>${origin.slice(0, 3).toUpperCase()}</b><span>${origin}</span></div><div class="line"><div>${t.kode_lokomotif || 'Kereta'}</div><hr><small>${formatDate(t.tanggal_perjalanan || '')}</small></div><div class="station"><b>${destination.slice(0, 3).toUpperCase()}</b><span>${destination}</span></div></div><div class="info"><div><small>Penumpang</small><b>${t.nama_pemesan}</b></div><div><small>Gerbong / Kursi</small><b>${t.seats.join(', ')}</b></div><div><small>No. Tiket</small><b>${t.id_transaksi.replace('TRX', 'TKT')}</b></div></div><div class="foot">Tunjukkan tiket dan identitas resmi saat proses boarding.</div></div><script>window.print()<\/script></body></html>`;
  const url = URL.createObjectURL(new Blob([html], { type: 'text/html' }));
  const link = document.createElement('a');
  link.href = url;
  link.download = `tiket-${t.id_transaksi}.html`;
  link.click();
  URL.revokeObjectURL(url);
}

function formatDuration(departure: string, arrival: string) {
  const [departureHours, departureMinutes] = departure.split(':').map(Number);
  const [arrivalHours, arrivalMinutes] = arrival.split(':').map(Number);
  let durationMinutes = arrivalHours * 60 + arrivalMinutes - (departureHours * 60 + departureMinutes);
  if (durationMinutes < 0) durationMinutes += 24 * 60;
  return `${Math.floor(durationMinutes / 60)}j ${durationMinutes % 60}m`;
}

function rupiah(value: number) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(value);
}

function Badge({ status }: { status: Status }) {
  const style = status === 'Terverifikasi' ? 'green' : status === 'Menunggu Pembayaran' ? 'orange' : status === 'Menunggu Verifikasi' ? 'blue' : 'gray';
  return <span className={`badge badge-${style}`}><span className="badge-dot" />{status}</span>;
}

function Modal({ title, onClose, children, wide = false }: { title: string; onClose: () => void; children: ReactNode; wide?: boolean }) {
  return <div className="modal-backdrop" onMouseDown={onClose}><div className={`modal ${wide ? 'modal-wide' : ''}`} onMouseDown={e => e.stopPropagation()}>
    <div className="modal-head"><div><p className="eyebrow">Form data</p><h3>{title}</h3></div><button className="icon-btn" onClick={onClose}><Icon name="close" /></button></div>
    {children}
  </div></div>;
}

function EmptyState({ title, text }: { title: string; text: string }) {
  return <div className="empty"><div className="empty-icon"><Icon name="ticket" size={28} /></div><h3>{title}</h3><p>{text}</p></div>;
}

export default function App() {
  const [role, setRole] = useState<Role | null>(null);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [page, setPage] = useState<Page>('jadwal');
  const [mobileNav, setMobileNav] = useState(false);
  const [stopDrawer, setStopDrawer] = useState<JourneySchedule | null>(null);
  const [bookingSchedule, setBookingSchedule] = useState<JourneySchedule | null>(null);
  const [transactions, setTransactions] = useStoredState('jugijak-transactions', initialTransactions);
  const [stationRows, setStationRows] = useStoredState<string[][]>('jugijak-stations', initialStations);
  const [locomotiveRows, setLocomotiveRows] = useStoredState<string[][]>('jugijak-locomotives', initialLocomotives);
  const [coachRows, setCoachRows] = useStoredState<string[][]>('jugijak-coaches', []);
  const [scheduleRows, setScheduleRows] = useStoredState<string[][]>('jugijak-schedules', []);
  const schedules = useMemo(() => scheduleRowsToJourneys(scheduleRows), [scheduleRows]);
  const [toast, setToast] = useState('');

  useEffect(() => {
    const migrationKey = 'jugijak-station-list-v3';
    try {
      if (localStorage.getItem(migrationKey)) return;
      if (stationRows.length === 0) {
        localStorage.setItem('jugijak-stations', JSON.stringify(initialStations));
        setStationRows(initialStations);
      }
      localStorage.setItem(migrationKey, 'true');
    } catch (error) {
      console.error('Gagal memuat daftar stasiun awal.', error);
    }
  }, []);

  useEffect(() => {
    const migrationKey = 'jugijak-locomotive-list-v3';
    try {
      if (localStorage.getItem(migrationKey)) return;
      if (locomotiveRows.length === 0) {
        localStorage.setItem('jugijak-locomotives', JSON.stringify(initialLocomotives));
        setLocomotiveRows(initialLocomotives);
      }
      localStorage.setItem(migrationKey, 'true');
    } catch (error) {
      console.error('Gagal memuat daftar lokomotif awal.', error);
    }
  }, []);

  useEffect(() => {
    const migrationKey = 'jugijak-locomotive-list-v4';
    try {
      if (localStorage.getItem(migrationKey)) return;
      const saved = localStorage.getItem('jugijak-locomotives');
      if (saved !== null) {
        const savedRows = JSON.parse(saved) as string[][];
        const containsOnlySeedRows = savedRows.every(row =>
          initialLocomotives.some(seed => seed.every((value, index) => row[index] === value)),
        );
        if (savedRows.length > 0 && containsOnlySeedRows && savedRows.length < initialLocomotives.length) {
          setLocomotiveRows([
            ...savedRows,
            ...initialLocomotives.filter(seed => !savedRows.some(row => row[0] === seed[0])),
          ]);
        }
      }
      localStorage.setItem(migrationKey, 'true');
    } catch (error) {
      console.error('Gagal melengkapi daftar lokomotif awal.', error);
    }
  }, []);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(''), 2800);
    return () => clearTimeout(timer);
  }, [toast]);

  const login = (selectedRole: Role) => {
    setRole(selectedRole);
    setPage(selectedRole === 'petugas' ? 'layani' : 'jadwal');
  };

  const logout = () => {
    setRole(null);
    setAuthMode('login');
    setMobileNav(false);
  };

  const startBooking = (schedule: JourneySchedule) => {
    setBookingSchedule(schedule);
    setPage('pesan');
    setStopDrawer(null);
  };

  if (!role) {
    return <AuthScreen mode={authMode} setMode={setAuthMode} onLogin={login} onToast={setToast} toast={toast} />;
  }

  const customerNav: { page: Page; label: string; icon: IconName }[] = [
    { page: 'jadwal', label: 'Jadwal', icon: 'calendar' },
    { page: 'transaksi', label: 'Transaksi', icon: 'receipt' },
    { page: 'tiket', label: 'Tiket & Riwayat', icon: 'ticket' },
  ];

  return <div className={role === 'petugas' ? 'staff-shell' : 'app-shell'}>
    {role === 'pemesan' ? (
      <header className="topnav">
        <button className="brand" onClick={() => setPage('jadwal')}><span className="brand-mark"><Icon name="train" /></span><span>JUGIJAK<span>GIJUK</span></span></button>
        <nav className={mobileNav ? 'nav-links open' : 'nav-links'}>
          {customerNav.map(item => <button key={item.page} className={page === item.page ? 'active' : ''} onClick={() => { setPage(item.page); setMobileNav(false); }}><Icon name={item.icon} size={18} />{item.label}</button>)}
        </nav>
        <div className="nav-account"><span className="avatar">AN</span><div><strong>Andi Nugraha</strong><small>Pemesan</small></div><button className="icon-btn" onClick={logout} title="Keluar"><Icon name="logout" size={18} /></button></div>
        <button className="mobile-menu" onClick={() => setMobileNav(!mobileNav)}><Icon name={mobileNav ? 'close' : 'menu'} /></button>
      </header>
    ) : <StaffSidebar page={page} setPage={setPage} mobileNav={mobileNav} setMobileNav={setMobileNav} onLogout={logout} />}

    <main className={role === 'petugas' ? 'staff-main' : ''}>
      {role === 'pemesan' && page === 'jadwal' && <SchedulePage schedules={schedules} stations={stationRows} locomotives={locomotiveRows} coaches={coachRows} onStops={setStopDrawer} onBook={startBooking} />}
      {role === 'pemesan' && page === 'pesan' && <BookingWizard initialSchedule={bookingSchedule} schedules={schedules} coaches={coachRows} locomotives={locomotiveRows} transactions={transactions} onDone={(trx) => { setTransactions([trx, ...transactions]); setPage('transaksi'); setToast('Pesanan berhasil dibuat'); }} />}
      {role === 'pemesan' && page === 'transaksi' && <TransactionsPage transactions={transactions} setTransactions={setTransactions} onToast={setToast} />}
      {role === 'pemesan' && page === 'tiket' && <TicketsPage transactions={transactions} />}
      {role === 'petugas' && page === 'layani' && <ServicePage transactions={transactions} setTransactions={setTransactions} onToast={setToast} />}
      {role === 'petugas' && page !== 'layani' && <CrudPage key={page} type={page} onToast={setToast} rowsOverride={page === 'stasiun' ? stationRows : page === 'lokomotif' ? locomotiveRows : page === 'gerbong' ? coachRows : page === 'kelola-jadwal' ? scheduleRows : undefined} onRowsChange={page === 'stasiun' ? setStationRows : page === 'lokomotif' ? setLocomotiveRows : page === 'gerbong' ? setCoachRows : page === 'kelola-jadwal' ? setScheduleRows : undefined} onSchedulesChange={setScheduleRows} stations={stationRows} locomotiveRows={locomotiveRows} coachRows={coachRows} scheduleRows={scheduleRows} />}
    </main>

    {stopDrawer && <StopsDrawer schedule={stopDrawer} canBook={coachRows.some(coach => coach[4] === stopDrawer.kode_lokomotif)} onClose={() => setStopDrawer(null)} onBook={() => startBooking(stopDrawer)} />}
    {toast && <div className="toast"><span><Icon name="check" size={16} /></span>{toast}</div>}
  </div>;
}

function AuthScreen({ mode, setMode, onLogin, onToast, toast }: { mode: 'login' | 'register'; setMode: (m: 'login' | 'register') => void; onLogin: (r: Role) => void; onToast: (s: string) => void; toast: string }) {
  const [loginRole, setLoginRole] = useState<Role>('pemesan');
  const [showPassword, setShowPassword] = useState(false);
  return <div className="auth-page">
    <section className="auth-visual">
      <div className="auth-pattern" />
      <div className="visual-content">
        <div className="brand brand-light"><span className="brand-mark"><Icon name="train" /></span><span>JUGIJAK<span>GIJUK</span></span></div>
        <div className="visual-copy"><span className="visual-pill">Perjalanan lebih mudah</span><h1>Satu tiket,<br />banyak <em>cerita.</em></h1><p>Pesan perjalanan kereta favoritmu dengan cepat, aman, dan nyaman dari mana saja.</p></div>
        <div className="route-art">
          <div className="route-station"><span>BD</span><b>Bandung</b></div><div className="rail-line"><i /><Icon name="train" size={26} /><i /></div><div className="route-station"><span>YK</span><b>Yogyakarta</b></div>
        </div>
        <p className="copyright">© 2025 JUGIJAKGIJUK Indonesia</p>
      </div>
    </section>
    <section className="auth-form-wrap">
      <div className="mobile-brand brand"><span className="brand-mark"><Icon name="train" /></span><span>JUGIJAK<span>GIJUK</span></span></div>
      <div className="auth-form">
        <p className="eyebrow">{mode === 'login' ? 'Selamat datang kembali' : 'Buat akun baru'}</p>
        <h2>{mode === 'login' ? 'Masuk ke akunmu' : 'Mulai perjalananmu'}</h2>
        <p className="form-intro">{mode === 'login' ? 'Masukkan detail akun untuk melanjutkan perjalanan.' : 'Isi data berikut untuk membuat akun pemesan.'}</p>
        {mode === 'login' ? <>
          <div className="role-toggle"><button className={loginRole === 'pemesan' ? 'active' : ''} onClick={() => setLoginRole('pemesan')}><Icon name="user" size={17} />Pemesan</button><button className={loginRole === 'petugas' ? 'active' : ''} onClick={() => setLoginRole('petugas')}><Icon name="building" size={17} />Petugas</button></div>
          <label>Email<input defaultValue={loginRole === 'pemesan' ? 'andi@email.com' : 'petugas@jugijakgijuk.id'} key={loginRole} type="email" /></label>
          <label>Password<div className="input-action"><input defaultValue="jugijak123" type={showPassword ? 'text' : 'password'} /><button onClick={() => setShowPassword(!showPassword)} type="button">{showPassword ? 'Sembunyikan' : 'Lihat'}</button></div></label>
          <div className="form-options"><label className="check-label"><input type="checkbox" /> Ingat saya</label><button>Lupa password?</button></div>
          <button className="primary-btn full" onClick={() => onLogin(loginRole)}>Masuk <Icon name="arrow" size={18} /></button>
          <p className="switch-copy">Belum punya akun? <button onClick={() => setMode('register')}>Daftar sekarang</button></p>
        </> : <>
          <div className="form-grid"><label>Nama lengkap<input placeholder="Nama sesuai identitas" /></label><label>No. identitas<input placeholder="16 digit NIK" /></label></div>
          <label>Email<input type="email" placeholder="nama@email.com" /></label>
          <label>Password<input type="password" placeholder="Minimal 8 karakter" /></label>
          <label className="check-label terms"><input type="checkbox" /> Saya menyetujui Syarat & Ketentuan JUGIJAKGIJUK</label>
          <button className="primary-btn full" onClick={() => { onToast('Registrasi berhasil, silakan masuk'); setMode('login'); }}>Buat Akun <Icon name="arrow" size={18} /></button>
          <p className="switch-copy">Sudah punya akun? <button onClick={() => setMode('login')}>Masuk</button></p>
        </>}
      </div>
      {toast && <div className="toast"><span><Icon name="check" size={16} /></span>{toast}</div>}
    </section>
  </div>;
}

function PageHeader({ eyebrow, title, text, action }: { eyebrow: string; title: string; text: string; action?: ReactNode }) {
  return <div className="page-header"><div><p className="eyebrow">{eyebrow}</p><h1>{title}</h1><p>{text}</p></div>{action}</div>;
}

function SchedulePage({ schedules, stations, locomotives, coaches, onStops, onBook }: { schedules: JourneySchedule[]; stations: string[][]; locomotives: string[][]; coaches: string[][]; onStops: (s: JourneySchedule) => void; onBook: (s: JourneySchedule) => void }) {
  const [from, setFrom] = useState('Semua Asal');
  const [to, setTo] = useState('Semua Tujuan');
  const [date, setDate] = useState('');
  const filteredSchedules = schedules.filter(schedule =>
    (from === 'Semua Asal' || from === schedule.stasiun_asal) &&
    (to === 'Semua Tujuan' || to === schedule.stasiun_tujuan) &&
    (!date || date === schedule.tanggal),
  );
  return <div className="page-container">
    <section className="welcome"><div><p className="eyebrow">Halo, Andi</p><h1>Mau pergi ke mana?</h1><p>Temukan jadwal terbaik untuk perjalanan berikutnya.</p></div><div className="welcome-train"><Icon name="train" size={74} /></div></section>
    <div className="search-card">
      <label><span>Stasiun asal</span><div className="select-wrap"><Icon name="building" size={19} /><select value={from} onChange={e => setFrom(e.target.value)}><option>Semua Asal</option>{stations.map(([id, name]) => <option key={id}>{name}</option>)}</select></div></label>
      <button className="swap" onClick={() => { if (to !== 'Semua Tujuan') { setFrom(to); setTo(from === 'Semua Asal' ? 'Semua Tujuan' : from); } }}>⇄</button>
      <label><span>Stasiun tujuan</span><div className="select-wrap"><Icon name="map" size={19} /><select value={to} onChange={e => setTo(e.target.value)}><option>Semua Tujuan</option>{stations.map(([id, name]) => <option key={id}>{name}</option>)}</select></div></label>
      <label><span>Tanggal pergi</span><div className="select-wrap"><Icon name="calendar" size={19} /><input type="date" value={date} onChange={e => setDate(e.target.value)} /></div></label>
      <button className="primary-btn search-btn"><Icon name="search" size={18} />Cari Jadwal</button>
    </div>
    <div className="section-title"><div><h2>Jadwal tersedia</h2><p>{filteredSchedules.length} perjalanan ditemukan</p></div><span>Diurutkan: Keberangkatan</span></div>
    <div className="schedule-list">
      {filteredSchedules.map(s => {
        const locomotiveName = locomotives.find(([code]) => code === s.kode_lokomotif)?.[1] || s.kode_lokomotif;
        return <article className="schedule-card" key={s.id_jadwal}>
        <div className="train-id"><div className="train-icon"><Icon name="train" /></div><div><strong>{locomotiveName}</strong><span><i />{s.kode_lokomotif}</span></div></div>
        <div className="journey"><div><strong>{s.waktu_berangkat}</strong><span>{s.stasiun_asal}</span><small>{formatDate(s.tanggal)}</small></div><div className="journey-line"><span>{formatDuration(s.waktu_berangkat, s.waktu_tiba)}</span><i /><Icon name="train" size={16} /><i /><button onClick={() => onStops(s)}>Lihat {s.stops.length} pemberhentian</button></div><div className="align-right"><strong>{s.waktu_tiba}</strong><span>{s.stasiun_tujuan}</span><small>{formatDate(s.tanggal)}</small></div></div>
        <div className="schedule-price"><small>Mulai dari</small><strong>{rupiah(s.harga)}</strong><span>/ orang</span><button className="primary-btn" disabled={!coaches.some(coach => coach[4] === s.kode_lokomotif)} title={!coaches.some(coach => coach[4] === s.kode_lokomotif) ? 'Belum ada gerbong untuk lokomotif ini' : undefined} onClick={() => onBook(s)}>Pesan</button></div>
      </article>;
      })}
      {!filteredSchedules.length && <EmptyState title={schedules.length ? 'Jadwal tidak ditemukan' : 'Belum ada jadwal'} text={schedules.length ? 'Coba ubah stasiun atau tanggal pencarian.' : 'Jadwal perjalanan akan tampil setelah Petugas menambahkannya.'} />}
    </div>
  </div>;
}

function StopsDrawer({ schedule, canBook, onClose, onBook }: { schedule: JourneySchedule; canBook: boolean; onClose: () => void; onBook: () => void }) {
  return <div className="drawer-backdrop" onClick={onClose}><aside className="drawer" onClick={e => e.stopPropagation()}>
    <div className="drawer-head"><div><p className="eyebrow">Detail perjalanan</p><h2>Pemberhentian</h2></div><button className="icon-btn" onClick={onClose}><Icon name="close" /></button></div>
    <div className="drawer-route"><span>{schedule.stasiun_asal}</span><Icon name="arrow" /><span>{schedule.stasiun_tujuan}</span></div>
    <div className="timeline">{schedule.stops.map((stop, i) => <div className="timeline-row" key={stop}><div className="time">{i === 0 ? schedule.waktu_berangkat : i === schedule.stops.length - 1 ? schedule.waktu_tiba : `${9 + i}:15`}</div><div className={`timeline-dot ${i === 0 || i === schedule.stops.length - 1 ? 'major' : ''}`}><i /></div><div><strong>{stop}</strong><span>{i === 0 ? 'Berangkat' : i === schedule.stops.length - 1 ? 'Tiba tujuan' : `Berhenti 5 menit · Urutan ${i + 1}`}</span></div></div>)}</div>
    <div className="drawer-summary"><span>Durasi perjalanan</span><strong>{formatDuration(schedule.waktu_berangkat, schedule.waktu_tiba)}</strong></div>
    {!canBook && <p className="secure-note">Belum ada gerbong untuk lokomotif pada jadwal ini.</p>}
    <button className="primary-btn full" disabled={!canBook} onClick={onBook}>Pilih jadwal ini <Icon name="arrow" size={18} /></button>
  </aside></div>;
}

function BookingWizard({ initialSchedule, schedules, coaches, locomotives, transactions, onDone }: { initialSchedule: JourneySchedule | null; schedules: JourneySchedule[]; coaches: string[][]; locomotives: string[][]; transactions: Transaction[]; onDone: (t: Transaction) => void }) {
  const [step, setStep] = useState(initialSchedule ? 2 : 1);
  const [schedule, setSchedule] = useState<JourneySchedule | null>(initialSchedule || schedules[0] || null);
  const initialCoach = coaches.find(row => row[4] === (initialSchedule || schedules[0])?.kode_lokomotif)?.[0] || '';
  const [coach, setCoach] = useState(initialCoach);
  const [seats, setSeats] = useState<string[]>([]);
  const [passengerNames, setPassengerNames] = useState<Record<string, string>>({});
  const bookedSeats = useMemo(() => transactions.flatMap(t => t.seats), [transactions]);
  const availableCoaches = coaches.filter(row => row[4] === schedule?.kode_lokomotif);
  const selectedCoach = availableCoaches.find(row => row[0] === coach);
  const seatList = Array.from({ length: Number(selectedCoach?.[2] || 0) }, (_, i) => `${coach}-${String(Math.floor(i / 4) + 1).padStart(2, '0')}${['A', 'B', 'C', 'D'][i % 4]}`);
  const toggleSeat = (seat: string) => setSeats(v => v.includes(seat) ? v.filter(x => x !== seat) : v.length < 4 ? [...v, seat] : v);

  if (!schedule) return <div className="page-container"><EmptyState title="Belum ada jadwal" text="Jadwal perjalanan akan tampil setelah Petugas menambahkannya." /></div>;

  const complete = () => {
    const names = seats.map(seat => passengerNames[seat]?.trim() || '');
    if (names.some(name => !name)) return;
    onDone({
      id_transaksi: `TRX-${Date.now().toString().slice(-8)}`, batas_bayar: new Date(Date.now() + 60 * 60000), status: 'Menunggu Pembayaran', tanggal_transaksi: 'Hari ini', id_pemesan: 'PMS001', nama_pemesan: names[0], nama_penumpang: names, id_petugas: null, verified_at: null, route: `${schedule.stasiun_asal} — ${schedule.stasiun_tujuan}`, seats, total: schedule.harga * seats.length, method: '', tanggal_perjalanan: schedule.tanggal, waktu_berangkat: schedule.waktu_berangkat, waktu_tiba: schedule.waktu_tiba, kode_lokomotif: schedule.kode_lokomotif,
    });
  };

  return <div className="page-container booking-page">
    <button className="back-link" onClick={() => step > 1 && setStep(step - 1)}>← Kembali</button>
    <PageHeader eyebrow="Pemesanan tiket" title="Lengkapi perjalananmu" text="Ikuti langkah berikut untuk menyelesaikan pesanan." />
    <div className="stepper">{['Pilih Jadwal', 'Pilih Gerbong & Kursi', 'Data Penumpang'].map((label, i) => <div className={step >= i + 1 ? 'step active' : 'step'} key={label}><span>{step > i + 1 ? <Icon name="check" size={15} /> : i + 1}</span><b>{label}</b>{i < 2 && <i />}</div>)}</div>
    {step === 1 && <div className="panel"><h2>Pilih jadwal keberangkatan</h2>{schedules.map(s => <button className={`select-schedule ${schedule.id_jadwal === s.id_jadwal ? 'selected' : ''}`} onClick={() => { setSchedule(s); setCoach(coaches.find(row => row[4] === s.kode_lokomotif)?.[0] || ''); }} key={s.id_jadwal}><span className="radio" /><div><b>{s.stasiun_asal} → {s.stasiun_tujuan}</b><small>{formatDate(s.tanggal)} · {s.waktu_berangkat}–{s.waktu_tiba}</small></div><strong>{rupiah(s.harga)}</strong></button>)}<div className="panel-actions"><button className="primary-btn" disabled={!schedules.length} onClick={() => setStep(2)}>Lanjut pilih kursi <Icon name="arrow" size={18} /></button></div></div>}
    {step === 2 && <div className="booking-grid">
      <section className="panel">
        <div className="panel-heading"><div><p className="eyebrow">Gerbong tersedia</p><h2>Pilih gerbong</h2></div><span className="seat-count">{seats.length} kursi dipilih</span></div>
        {availableCoaches.length ? <div className="coach-tabs">{availableCoaches.map(row => <button onClick={() => { setCoach(row[0]); setSeats([]); }} className={coach === row[0] ? 'active' : ''} key={row[0]}><Icon name="coach" /><span><b>Gerbong {row[1]}</b><small>{row[3]} · {row[2]} kursi</small></span></button>)}</div> : <EmptyState title="Belum ada gerbong" text="Petugas perlu menambahkan gerbong untuk lokomotif pada jadwal ini." />}
        {selectedCoach?.[5] && <div className="amenities">{selectedCoach[5].split(',').map((amenity, index) => <span key={`${amenity}-${index}`}><Icon name={amenity.trim().toLowerCase() === 'wifi' ? 'wifi' : amenity.trim().toLowerCase() === 'ac' ? 'snow' : amenity.trim().toLowerCase() === 'tv' ? 'tv' : 'toilet'} size={16} />{amenity.trim()}</span>)}</div>}
        <div className="seat-legend"><span><i className="available" />Tersedia</span><span><i className="chosen" />Dipilih</span><span><i className="booked" />Terisi</span></div>
        {selectedCoach && <div className="coach-map"><div className="coach-front"><Icon name="train" /><span>Depan kereta</span></div><div className="seats">{seatList.map(seat => { const isBooked = bookedSeats.includes(seat); return <button key={seat} disabled={isBooked} className={seats.includes(seat) ? 'chosen' : ''} onClick={() => toggleSeat(seat)}><Icon name="seat" size={17} /><span>{seat.split('-').pop()}</span></button>; })}</div></div>}
      </section>
      <BookingSummary schedule={schedule} seats={seats}><button disabled={!seats.length} className="primary-btn full" onClick={() => setStep(3)}>Isi data penumpang <Icon name="arrow" size={18} /></button></BookingSummary>
    </div>}
    {step === 3 && <div className="booking-grid">
      <section className="panel passenger-panel"><p className="eyebrow">Detail penumpang</p><h2>Isi data penumpang</h2><p>Pastikan data sesuai dengan kartu identitas.</p>
        {seats.map((seat, i) => <div className="passenger-form" key={seat}><div className="passenger-title"><span>{i + 1}</span><div><b>Penumpang {i + 1}</b><small>Kursi {seat}</small></div></div><div className="form-grid three"><label>Nama lengkap<input required value={passengerNames[seat] || ''} onChange={event => setPassengerNames(names => ({ ...names, [seat]: event.target.value }))} placeholder="Sesuai identitas" /></label><label>Tanggal lahir<input type="date" defaultValue={i === 0 ? '1995-08-12' : ''} /></label><label>Jenis kelamin<select defaultValue="Laki-laki"><option>Laki-laki</option><option>Perempuan</option></select></label></div></div>)}
      </section>
      <BookingSummary schedule={schedule} seats={seats}><button className="primary-btn full" disabled={!seats.length || seats.some(seat => !passengerNames[seat]?.trim())} onClick={complete}>Buat pesanan <Icon name="check" size={18} /></button><p className="secure-note">Dengan melanjutkan, kamu menyetujui ketentuan pemesanan.</p></BookingSummary>
    </div>}
  </div>;
}

function BookingSummary({ schedule, seats, children }: { schedule: JourneySchedule; seats: string[]; children: ReactNode }) {
  return <aside className="panel summary-card"><p className="eyebrow">Ringkasan perjalanan</p><h3>{schedule.stasiun_asal} <Icon name="arrow" size={17} /> {schedule.stasiun_tujuan}</h3><div className="summary-detail"><span><Icon name="calendar" size={17} />{formatDate(schedule.tanggal)}</span><span><Icon name="clock" size={17} />{schedule.waktu_berangkat}–{schedule.waktu_tiba}</span><span><Icon name="seat" size={17} />{seats.length ? seats.join(', ') : 'Belum ada kursi'}</span></div><hr /><div className="price-row"><span>Harga tiket</span><span>{seats.length || 1} × {rupiah(schedule.harga)}</span></div><div className="price-row total"><span>Total</span><strong>{rupiah(schedule.harga * seats.length)}</strong></div>{children}</aside>;
}

function TransactionsPage({ transactions, setTransactions, onToast }: { transactions: typeof initialTransactions; setTransactions: (v: typeof initialTransactions) => void; onToast: (s: string) => void }) {
  const [paying, setPaying] = useState<(typeof initialTransactions)[0] | null>(null);
  const [canceling, setCanceling] = useState<(typeof initialTransactions)[0] | null>(null);
  const [detail, setDetail] = useState<(typeof initialTransactions)[0] | null>(null);
  const [filter, setFilter] = useState<'Semua' | 'Aktif' | 'Selesai' | 'Dibatalkan'>('Semua');
  const [method, setMethod] = useState('Transfer Bank');
  const [seconds, setSeconds] = useState(42 * 60);
  useEffect(() => { const timer = setInterval(() => setSeconds(s => Math.max(0, s - 1)), 1000); return () => clearInterval(timer); }, []);
  const countdown = `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`;
  const submitPayment = () => {
    if (!paying) return;
    setTransactions(transactions.map(t => t.id_transaksi === paying.id_transaksi ? { ...t, status: 'Menunggu Verifikasi' as Status, method } : t));
    setPaying(null); onToast('Pembayaran dikirim untuk diverifikasi');
  };
  const cancelTransaction = () => {
    if (!canceling || canceling.status !== 'Menunggu Pembayaran') return;
    setTransactions(transactions.map(t => t.id_transaksi === canceling.id_transaksi && t.status === 'Menunggu Pembayaran' ? { ...t, status: 'Dibatalkan' as Status } : t));
    setCanceling(null);
    onToast('Transaksi berhasil dibatalkan');
  };
  const visibleTransactions = transactions.filter(t => {
    if (filter === 'Aktif') return t.status === 'Menunggu Pembayaran' || t.status === 'Menunggu Verifikasi';
    if (filter === 'Selesai') return t.status === 'Terverifikasi';
    if (filter === 'Dibatalkan') return t.status === 'Dibatalkan';
    return true;
  });
  return <div className="page-container"><PageHeader eyebrow="Transaksi saya" title="Kelola transaksi" text="Pantau status dan selesaikan pembayaran tiketmu." />
    <div className="filter-tabs">{(['Semua', 'Aktif', 'Selesai', 'Dibatalkan'] as const).map(item => <button key={item} className={filter === item ? 'active' : ''} onClick={() => setFilter(item)}>{item}{item === 'Semua' && <span>{transactions.length}</span>}</button>)}</div>
    {visibleTransactions.length ? <div className="transaction-list">{visibleTransactions.map(t => <article className="transaction-card" key={t.id_transaksi}><div className="transaction-top"><div><small>ID Transaksi</small><strong>{t.id_transaksi}</strong></div><Badge status={t.status} /></div><div className="transaction-body"><div className="route-mini"><span className="train-icon"><Icon name="train" /></span><div><small>Perjalanan</small><strong>{t.route}</strong><span>{t.tanggal_transaksi} · {t.seats.join(', ')}</span></div></div><div><small>Total pembayaran</small><strong className="total-price">{rupiah(t.total)}</strong></div>{t.status === 'Menunggu Pembayaran' && <div className="countdown"><Icon name="clock" size={17} /><div><small>Batas pembayaran</small><strong>{countdown}</strong></div></div>}</div><div className="transaction-actions"><button className="secondary-btn" onClick={() => setDetail(t)}>Lihat detail</button>{t.status === 'Menunggu Pembayaran' && <><button className="danger-btn" onClick={() => setCanceling(t)}>Batalkan</button><button className="primary-btn" onClick={() => setPaying(t)}>Bayar sekarang</button></>}</div></article>)}</div> : <EmptyState title={`Tidak ada transaksi ${filter.toLowerCase()}`} text={filter === 'Dibatalkan' ? 'Pesanan yang kamu batalkan sebelum membayar akan muncul di sini.' : 'Transaksi dengan status ini akan muncul di sini.'} />}
    {canceling && <Modal title="Batalkan Transaksi?" onClose={() => setCanceling(null)}><div className="payment-total"><span>{canceling.id_transaksi}</span><strong>{canceling.route}</strong><small>{rupiah(canceling.total)}</small></div><p>Pesanan yang belum dibayar akan dibatalkan dan tidak bisa dipulihkan. Setelah dibatalkan, transaksi ini bisa dilihat di tab Dibatalkan.</p><div className="modal-actions"><button className="secondary-btn" onClick={() => setCanceling(null)}>Kembali</button><button className="danger-btn" onClick={cancelTransaction}>Ya, batalkan pesanan</button></div></Modal>}
    {paying && <Modal title="Bayar Transaksi" onClose={() => setPaying(null)}><div className="payment-total"><span>Total pembayaran</span><strong>{rupiah(paying.total)}</strong><small>{paying.id_transaksi}</small></div><p className="field-title">Pilih metode pembayaran</p><div className="payment-methods">{['Transfer Bank', 'Virtual Account', 'E-Wallet'].map(m => <button key={m} className={method === m ? 'active' : ''} onClick={() => setMethod(m)}><span><Icon name="card" /><b>{m}</b></span><i /></button>)}</div><button className="primary-btn full" onClick={submitPayment}>Bayar {rupiah(paying.total)}</button></Modal>}
    {detail && <Modal title="Detail Transaksi" onClose={() => setDetail(null)}>
      <div className="detail-status"><Badge status={detail.status} /><strong>{detail.id_transaksi}</strong><span>Dibuat pada {detail.tanggal_transaksi}</span></div>
      <div className="detail-route"><span className="train-icon"><Icon name="train" /></span><div><small>Rute perjalanan</small><strong>{detail.route}</strong><span>Kereta {detail.kode_lokomotif || '—'} · {detail.seats.join(', ')}</span></div></div>
      <div className="detail-list"><p><span>Nama pemesan</span><b>{detail.nama_pemesan}</b></p><p><span>Metode pembayaran</span><b>{detail.method || 'Belum dipilih'}</b></p><p><span>Petugas verifikasi</span><b>{detail.id_petugas || '—'}</b></p><p className="detail-total"><span>Total pembayaran</span><b>{rupiah(detail.total)}</b></p></div>
      <button className="primary-btn full" onClick={() => setDetail(null)}>Tutup Detail</button>
    </Modal>}
  </div>;
}

function hasJourneyFinished(transaction: Transaction, now = new Date()) {
  if (!transaction.tanggal_perjalanan) return false;
  const arrivalTime = transaction.waktu_tiba || '23:59';
  const arrival = new Date(`${transaction.tanggal_perjalanan}T${arrivalTime}`);
  return !Number.isNaN(arrival.getTime()) && arrival.getTime() < now.getTime();
}

function TicketsPage({ transactions }: { transactions: typeof initialTransactions }) {
  const [tab, setTab] = useState<'aktif' | 'riwayat'>('aktif');
  const verified = transactions.filter(t => t.status === 'Terverifikasi');
  const now = new Date();
  const activeTickets = verified.filter(t => !hasJourneyFinished(t, now));
  const history = verified.filter(t => hasJourneyFinished(t, now));
  const shown = tab === 'aktif' ? activeTickets : history;
  return <div className="page-container"><PageHeader eyebrow="Perjalanan saya" title="Tiket & Riwayat" text="Akses boarding pass dan riwayat perjalananmu." />
    <div className="filter-tabs"><button className={tab === 'aktif' ? 'active' : ''} onClick={() => setTab('aktif')}>Tiket aktif <span>{activeTickets.length}</span></button><button className={tab === 'riwayat' ? 'active' : ''} onClick={() => setTab('riwayat')}>Riwayat perjalanan <span>{history.length}</span></button></div>
    {shown.length ? <div className="tickets-grid">{shown.map(t => <article className={`boarding-pass ${tab === 'riwayat' ? 'history-ticket' : ''}`} key={t.id_transaksi}><div className="ticket-accent" /><div className="ticket-main"><div className="ticket-brand"><span className="brand-mark"><Icon name="train" /></span><b>JUGIJAKGIJUK</b>{tab === 'aktif' ? <Badge status={t.status} /> : <span className="journey-done"><Icon name="check" size={13} />Perjalanan selesai</span>}</div><p>BOARDING PASS · E-TICKET</p><div className="ticket-route"><div><strong>{t.route.split(' — ')[0].slice(0,3).toUpperCase()}</strong><span>{t.route.split(' — ')[0]}</span><small>{t.waktu_berangkat || '—'}</small></div><div><span>{t.kode_lokomotif || 'Kereta'}</span><i /><Icon name="train" /><i /><small>Durasi {t.waktu_berangkat && t.waktu_tiba ? formatDuration(t.waktu_berangkat, t.waktu_tiba) : '—'}</small></div><div><strong>{t.route.split(' — ')[1].slice(0,3).toUpperCase()}</strong><span>{t.route.split(' — ')[1]}</span><small>{t.waktu_tiba || '—'}</small></div></div><div className="ticket-details"><span><small>Penumpang</small><b>{t.nama_pemesan}</b></span><span><small>Tanggal</small><b>{formatDate(t.tanggal_perjalanan || '') || t.tanggal_transaksi}</b></span><span><small>Gerbong / Kursi</small><b>{t.seats.join(', ')}</b></span></div></div><div className="ticket-stub"><div className="qr">{Array.from({ length: 49 }, (_, i) => <i key={i} className={i % 3 === 0 || i % 7 === 1 ? 'fill' : ''} />)}</div><strong>{t.id_transaksi.replace('TRX','TKT')}</strong><small>{tab === 'aktif' ? 'Tunjukkan saat boarding' : 'Perjalanan telah selesai'}</small><button className="secondary-btn" onClick={() => downloadTicket(t)}><Icon name="print" size={16} />Unduh Tiket</button></div></article>)}</div> : <EmptyState title={tab === 'riwayat' ? 'Belum ada riwayat perjalanan' : 'Belum ada tiket aktif'} text={tab === 'riwayat' ? 'Tiket terverifikasi akan otomatis masuk ke riwayat setelah waktu tiba perjalanan lewat. Untuk uji coba, buat jadwal dengan waktu tiba yang sudah lewat.' : 'Tiket akan tampil di sini setelah pembayaran diverifikasi oleh petugas.'} />}
  </div>;
}

function StaffSidebar({ page, setPage, mobileNav, setMobileNav, onLogout }: { page: Page; setPage: (p: Page) => void; mobileNav: boolean; setMobileNav: (v: boolean) => void; onLogout: () => void }) {
  const items: { p: Page; label: string; icon: IconName }[] = [
    { p: 'layani', label: 'Layani Transaksi', icon: 'receipt' }, { p: 'stasiun', label: 'Stasiun', icon: 'building' }, { p: 'lokomotif', label: 'Lokomotif', icon: 'engine' }, { p: 'gerbong', label: 'Gerbong & Kursi', icon: 'coach' }, { p: 'kelola-jadwal', label: 'Jadwal & Pemberhentian', icon: 'calendar' },
  ];
  return <><header className="staff-mobile-head"><div className="brand"><span className="brand-mark"><Icon name="train" /></span><span>JUGIJAK<span>GIJUK</span></span></div><button className="icon-btn" onClick={() => setMobileNav(!mobileNav)}><Icon name="menu" /></button></header>
    <aside className={`sidebar ${mobileNav ? 'open' : ''}`}><div className="brand brand-light"><span className="brand-mark"><Icon name="train" /></span><span>JUGIJAK<span>GIJUK</span></span></div><div className="staff-label">Panel Petugas</div><nav><small>LAYANAN</small>{items.slice(0, 1).map(item => <SidebarItem key={item.p} item={item} page={page} onClick={() => { setPage(item.p); setMobileNav(false); }} />)}<small>DATA MASTER</small>{items.slice(1).map(item => <SidebarItem key={item.p} item={item} page={page} onClick={() => { setPage(item.p); setMobileNav(false); }} />)}</nav><div className="sidebar-profile"><span className="avatar">RS</span><div><strong>Rina Sari</strong><small>PTG001 · Petugas</small></div><button onClick={onLogout}><Icon name="logout" size={18} /></button></div></aside>
  </>;
}

function SidebarItem({ item, page, onClick }: { item: { p: Page; label: string; icon: IconName }; page: Page; onClick: () => void }) {
  return <button className={page === item.p ? 'active' : ''} onClick={onClick}><Icon name={item.icon} size={19} />{item.label}</button>;
}

function ServicePage({ transactions, setTransactions, onToast }: { transactions: typeof initialTransactions; setTransactions: (v: typeof initialTransactions) => void; onToast: (s: string) => void }) {
  const [query, setQuery] = useState('');
  const today = new Date();
  const todayKey = today.toDateString();
  const pendingVerificationCount = transactions.filter(t => t.status === 'Menunggu Verifikasi').length;
  const verifiedTodayCount = transactions.filter(t => t.status === 'Terverifikasi' && t.verified_at && new Date(t.verified_at).toDateString() === todayKey).length;
  const issuedTicketCount = transactions.filter(t => t.status === 'Terverifikasi').reduce((total, transaction) => total + transaction.seats.length, 0);
  const [detail, setDetail] = useState<{
    id: string; nama: string; penumpang: string[]; pemesan: string; route: string; seats: string[]; total: number; status: Status; tanggal: string; method: string; petugas: string | null; locomotive: string;
  } | null>(null);
  const verify = (id: string) => { setTransactions(transactions.map(t => t.id_transaksi === id ? { ...t, status: 'Terverifikasi', id_petugas: 'PTG001', verified_at: new Date().toISOString() } : t)); onToast('Pembayaran berhasil diverifikasi'); };
  const showTransaction = (t: Transaction) => setDetail({ id: t.id_transaksi, nama: t.nama_pemesan, penumpang: t.nama_penumpang || [t.nama_pemesan], pemesan: t.id_pemesan, route: t.route, seats: t.seats, total: t.total, status: t.status, tanggal: t.tanggal_transaksi, method: t.method || 'Belum dipilih', petugas: t.id_petugas, locomotive: t.kode_lokomotif || '—' });
  return <div className="staff-page"><PageHeader eyebrow="Layanan petugas" title="Layani Transaksi" text="Verifikasi pembayaran dan terbitkan tiket penumpang." action={<div className="date-chip"><Icon name="calendar" size={17} />{today.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</div>} />
    <div className="stats"><div><span className="stat-icon blue"><Icon name="receipt" /></span><p><small>Perlu diverifikasi</small><strong>{pendingVerificationCount}</strong></p></div><div><span className="stat-icon green"><Icon name="check" /></span><p><small>Terverifikasi hari ini</small><strong>{verifiedTodayCount}</strong></p></div><div><span className="stat-icon orange"><Icon name="ticket" /></span><p><small>Tiket diterbitkan</small><strong>{issuedTicketCount}</strong></p></div></div>
    <div className="data-panel"><div className="table-toolbar"><div><h2>Daftar transaksi</h2><p>Transaksi terbaru dari seluruh pemesan</p></div><div className="table-search"><Icon name="search" size={17} /><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Cari ID atau nama..." /></div></div>
      <div className="table-scroll"><table><thead><tr><th>ID Transaksi</th><th>Pemesan</th><th>Perjalanan</th><th>Total</th><th>Status</th><th>Aksi</th></tr></thead><tbody>{transactions.filter(t => t.id_transaksi.toLowerCase().includes(query.toLowerCase()) || t.nama_pemesan.toLowerCase().includes(query.toLowerCase())).map(t => <tr key={t.id_transaksi}><td><strong>{t.id_transaksi}</strong><small>{t.tanggal_transaksi}</small></td><td><strong>{t.nama_pemesan}</strong><small>{t.id_pemesan}</small></td><td><strong>{t.route}</strong><small>{t.seats.join(', ')}</small></td><td><strong>{rupiah(t.total)}</strong></td><td><Badge status={t.status} /></td><td><div className="service-actions"><button className="action-link muted" onClick={() => showTransaction(t)}>Lihat detail</button>{t.status === 'Menunggu Verifikasi' ? <button className="action-link" onClick={() => verify(t.id_transaksi)}>Verifikasi</button> : t.status === 'Terverifikasi' ? <button className="secondary-btn small" onClick={() => downloadTicket(t)}><Icon name="print" size={15} />Unduh Tiket</button> : null}</div></td></tr>)}
      {!transactions.length && <tr><td colSpan={6}><EmptyState title="Belum ada transaksi" text="Transaksi yang masuk akan ditampilkan di sini." /></td></tr>}
      </tbody></table></div>
    </div>
    {detail && <Modal title="Detail Transaksi Pemesan" onClose={() => setDetail(null)}>
      <div className="detail-status"><Badge status={detail.status} /><strong>{detail.id}</strong><span>{detail.tanggal}</span></div>
      <div className="detail-route"><span className="train-icon"><Icon name="train" /></span><div><small>Perjalanan</small><strong>{detail.route}</strong><span>Kereta {detail.locomotive} · Kursi {detail.seats.join(', ')}</span></div></div>
      <div className="detail-list"><p><span>Nama pemesan</span><b>{detail.nama}</b></p><p><span>Nama penumpang</span><b>{detail.penumpang.join(', ')}</b></p><p><span>ID pemesan</span><b>{detail.pemesan}</b></p><p><span>Metode pembayaran</span><b>{detail.method}</b></p><p><span>Petugas verifikasi</span><b>{detail.petugas || 'Belum diverifikasi'}</b></p><p className="detail-total"><span>Total pembayaran</span><b>{rupiah(detail.total)}</b></p></div>
      <div className="modal-actions"><button className="secondary-btn" onClick={() => setDetail(null)}>Tutup</button>{detail.status === 'Menunggu Verifikasi' && <button className="primary-btn" onClick={() => { verify(detail.id); setDetail(null); }}>Verifikasi Pembayaran</button>}</div>
    </Modal>}
  </div>;
}

const crudConfig = {
  stasiun: { title: 'Stasiun', text: 'Kelola stasiun yang tersedia dalam rute perjalanan.', icon: 'building' as IconName, columns: ['ID Stasiun', 'Nama Stasiun'], rows: [] as string[][], fields: ['ID Stasiun', 'Nama Stasiun'] },
  lokomotif: { title: 'Lokomotif', text: 'Kelola armada lokomotif yang beroperasi.', icon: 'engine' as IconName, columns: ['ID Lokomotif', 'Nama Lokomotif', 'Jenis'], rows: [], fields: ['ID Lokomotif', 'Nama Lokomotif', 'Jenis Lokomotif'] },
  gerbong: { title: 'Gerbong & Kursi', text: 'Atur gerbong, fasilitas, dan ketersediaan kursi.', icon: 'coach' as IconName, columns: ['Kode Gerbong', 'Nomor', 'Kapasitas', 'Kelas', 'Lokomotif', 'Fasilitas'], rows: [], fields: ['Kode Gerbong', 'Nomor Gerbong', 'Kapasitas', 'Kelas Gerbong', 'Kode Lokomotif', 'Fasilitas'] },
  'kelola-jadwal': { title: 'Jadwal & Pemberhentian', text: 'Susun jadwal perjalanan dan urutan pemberhentian.', icon: 'calendar' as IconName, columns: ['ID Jadwal', 'Stasiun Asal', 'Berangkat', 'Stasiun Tujuan', 'Tiba', 'Lokomotif', 'Tanggal', 'Harga', 'Pemberhentian antara'], rows: [], fields: ['ID Jadwal', 'Stasiun Asal', 'Waktu Berangkat', 'Stasiun Tujuan', 'Waktu Tiba', 'Kode Lokomotif', 'Tanggal Perjalanan', 'Harga Tiket', 'Pemberhentian antara'] },
};

function CrudPage({ type, onToast, rowsOverride, onRowsChange, onSchedulesChange, stations, locomotiveRows, coachRows, scheduleRows }: { type: Page; onToast: (s: string) => void; rowsOverride?: string[][]; onRowsChange?: (rows: string[][]) => void; onSchedulesChange: (rows: string[][]) => void; stations: string[][]; locomotiveRows: string[][]; coachRows: string[][]; scheduleRows: string[][] }) {
  const config = crudConfig[type as keyof typeof crudConfig] || crudConfig.stasiun;
  const [localRows, setLocalRows] = useState<string[][]>(config.rows);
  const rows = rowsOverride ?? localRows;
  const updateRows = onRowsChange ?? setLocalRows;
  const [modal, setModal] = useState<{ mode: 'add' | 'edit'; index?: number } | null>(null);
  const [draft, setDraft] = useState<string[]>([]);
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null);
  const requestDelete = (index: number) => {
    const row = rows[index];
    if (type === 'lokomotif' && (coachRows.some(coach => coach[4] === row[0]) || scheduleRows.some(schedule => schedule[5] === row[0]))) {
      onToast('Lokomotif masih digunakan oleh gerbong atau jadwal');
      return;
    }
    if (type === 'stasiun' && scheduleRows.some(schedule => schedule[1] === row[1] || schedule[3] === row[1] || (schedule[8] || '').split(',').includes(row[1]))) {
      onToast('Stasiun masih digunakan oleh jadwal');
      return;
    }
    setDeleteIndex(index);
  };
  const openAdd = () => {
    const nextNumber = Math.max(0, ...rows.map(row => Number(row[0].match(/\d+/)?.[0] || 0))) + 1;
    const prefix = type === 'stasiun' ? 'ST' : type === 'kelola-jadwal' ? 'JDW' : type === 'gerbong' ? 'GRB' : 'CC';
    const code = `${prefix}${String(nextNumber).padStart(3, '0')}`;
    if (type === 'lokomotif') setDraft([code, '', 'KAJJ']);
    else if (type === 'gerbong') setDraft([code, '', '', 'Eksekutif', locomotiveRows[0]?.[0] || '', '']);
    else if (type === 'kelola-jadwal') setDraft([code, stations[0]?.[1] || '', '', stations[1]?.[1] || '', '', locomotiveRows[0]?.[0] || '', new Date().toISOString().slice(0, 10), '', '']);
    else setDraft([code, '']);
    setModal({ mode: 'add' });
  };
  const openEdit = (index: number) => {
    setDraft(config.fields.map((_, i) => rows[index][i] || ''));
    setModal({ mode: 'edit', index });
  };
  const save = () => {
    if (draft.some((value, index) => (type === 'kelola-jadwal' && index === 8) || (type === 'gerbong' && index === 5) ? false : !value.trim())) { onToast('Lengkapi semua kolom terlebih dahulu'); return; }
    if (type === 'gerbong' && (Number(draft[1]) < 1 || Number(draft[2]) < 1)) { onToast('Nomor dan kapasitas gerbong harus lebih dari 0'); return; }
    if (type === 'gerbong' && !locomotiveRows.some(row => row[0] === draft[4])) { onToast('Pilih lokomotif yang tersedia'); return; }
    if (type === 'kelola-jadwal' && draft[1] === draft[3]) { onToast('Stasiun asal dan tujuan harus berbeda'); return; }
    if (type === 'kelola-jadwal' && (!stations.some(row => row[1] === draft[1]) || !stations.some(row => row[1] === draft[3]))) { onToast('Tambahkan stasiun asal dan tujuan terlebih dahulu'); return; }
    if (type === 'kelola-jadwal' && !locomotiveRows.some(row => row[0] === draft[5])) { onToast('Pilih lokomotif yang tersedia'); return; }
    if (type === 'kelola-jadwal' && Number(draft[7]) <= 0) { onToast('Harga tiket harus lebih dari 0'); return; }
    if (type === 'kelola-jadwal' && draft[8] && draft[8].split(',').some(name => !stations.some(row => row[1] === name))) { onToast('Pilih pemberhentian yang tersedia'); return; }
    if (modal?.mode === 'add') updateRows([...rows, draft]);
    if (modal?.mode === 'edit' && modal.index !== undefined) {
      const previousRow = rows[modal.index];
      updateRows(rows.map((row, index) => index === modal.index ? draft : row));
      if (type === 'stasiun' && previousRow[1] !== draft[1]) {
        onSchedulesChange(scheduleRows.map(schedule => [
          ...schedule.slice(0, 1),
          schedule[1] === previousRow[1] ? draft[1] : schedule[1],
          ...schedule.slice(2, 3),
          schedule[3] === previousRow[1] ? draft[1] : schedule[3],
          ...schedule.slice(4, 8),
          (schedule[8] || '').split(',').map(name => name === previousRow[1] ? draft[1] : name).join(','),
        ]));
      }
    }
    setModal(null); onToast(`Data ${config.title.toLowerCase()} berhasil disimpan`);
  };
  const setDraftValue = (index: number, value: string) => setDraft(draft.map((item, itemIndex) => itemIndex === index ? value : item));
  const renderField = (field: string, index: number) => {
    const common = { value: draft[index] || '', onChange: (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => setDraftValue(index, event.target.value) };
    if (index === 0) return <><input {...common} disabled /><small className="auto-hint">Dibuat otomatis oleh sistem</small></>;
    if (type === 'stasiun' && index === 1) return <input {...common} placeholder="Masukkan nama stasiun" />;
    if (type === 'lokomotif' && index === 1) return <input {...common} placeholder="Masukkan nama lokomotif" />;
    if (type === 'lokomotif' && index === 2) return <select {...common}>{locomotiveTypes.map(locomotiveType => <option key={locomotiveType}>{locomotiveType}</option>)}</select>;
    if (type === 'gerbong' && index === 3) return <><select {...common}><option>Eksekutif</option><option>Bisnis</option><option>Ekonomi</option></select><small className="auto-hint">Kelas gerbong berdiri sendiri, bukan dari jenis lokomotif.</small></>;
    if ((type === 'gerbong' && index === 4) || (type === 'kelola-jadwal' && index === 5)) {
      const options = locomotiveRows.map(row => row[0]);
      return <select {...common}><option value="" disabled>Pilih kode lokomotif</option>{options.map(code => <option key={code}>{code}</option>)}</select>;
    }
    if (type === 'gerbong' && (index === 1 || index === 2)) return <input {...common} type="number" min="1" placeholder={`Masukkan ${field.toLowerCase()}`} />;
    if (type === 'gerbong' && index === 5) {
      const selectedFacilities = (draft[index] || '').split(',').filter(Boolean);
      return <div className="facility-checks">{['Toilet', 'WiFi', 'TV', 'AC'].map(facility => <label key={facility}><input type="checkbox" checked={selectedFacilities.includes(facility)} onChange={event => {
        const nextFacilities = event.target.checked
          ? [...selectedFacilities, facility]
          : selectedFacilities.filter(item => item !== facility);
        setDraftValue(index, nextFacilities.join(','));
      }} />{facility}</label>)}</div>;
    }
    if (type === 'kelola-jadwal' && (index === 1 || index === 3)) return <select {...common}><option value="" disabled>Pilih stasiun</option>{stations.map(([id, name]) => <option key={id}>{name}</option>)}</select>;
    if (type === 'kelola-jadwal' && (index === 2 || index === 4)) return <input {...common} type="time" />;
    if (type === 'kelola-jadwal' && index === 6) return <input {...common} type="date" />;
    if (type === 'kelola-jadwal' && index === 7) return <input {...common} type="number" min="1" placeholder="Masukkan harga tiket" />;
    if (type === 'kelola-jadwal' && index === 8) {
      const selectedStops = (draft[index] || '').split(',').filter(Boolean);
      return <div className="flex flex-col gap-2">
        <select value="" onChange={event => {
          const stop = event.target.value;
          if (stop && !selectedStops.includes(stop)) setDraftValue(index, [...selectedStops, stop].join(','));
        }}>
          <option value="">Pilih stasiun pemberhentian</option>
          {stations.filter(([, name]) => name !== draft[1] && name !== draft[3] && !selectedStops.includes(name)).map(([id, name]) => <option key={id} value={name}>{name}</option>)}
        </select>
        {selectedStops.length > 0 && <div className="flex flex-wrap gap-2">{selectedStops.map((stop, stopIndex) => <span className="inline-flex items-center gap-1 rounded bg-slate-100 px-2 py-1 text-xs" key={`${stop}-${stopIndex}`}>{stop}<button className="text-slate-500" type="button" aria-label={`Hapus ${stop}`} onClick={() => setDraftValue(index, selectedStops.filter((_, i) => i !== stopIndex).join(','))}><Icon name="close" size={14} /></button></span>)}</div>}
      </div>;
    }
    return <input {...common} placeholder={`Masukkan ${field.toLowerCase()}`} />;
  };
  return <div className="staff-page"><PageHeader eyebrow="Data master" title={config.title} text={config.text} action={<button className="primary-btn" onClick={openAdd}><Icon name="plus" size={18} />Tambah {type === 'kelola-jadwal' ? 'Jadwal' : config.title.split(' ')[0]}</button>} />
    <div className="data-panel"><div className="table-toolbar"><div><h2>Daftar {config.title.toLowerCase()}</h2><p>{rows.length} data tersimpan</p></div><div className="table-search"><Icon name="search" size={17} /><input placeholder="Cari data..." /></div></div>
      <div className="table-scroll"><table><thead><tr>{config.columns.map(c => <th key={c}>{c}</th>)}<th>Aksi</th></tr></thead><tbody>{rows.map((row, i) => <tr key={row[0]}>{config.columns.map((_, j) => <td key={j}>{j === 0 ? <strong>{row[j] || '—'}</strong> : type === 'kelola-jadwal' && j === 6 ? formatDate(row[j]) : type === 'kelola-jadwal' && j === 7 ? rupiah(Number(row[j])) : j === 8 ? row[j]?.replaceAll(',', ', ') || '—' : row[j] || '—'}</td>)}<td><div className="row-actions"><button title="Edit" onClick={() => openEdit(i)}><Icon name="edit" size={17} /></button>{type === 'gerbong' && <button title="Kelola kursi" onClick={() => onToast(`${row[2]} kursi pada ${row[0]}`)}><Icon name="seat" size={17} /></button>}{type === 'kelola-jadwal' && <button title="Pemberhentian" onClick={() => onToast(`Urutan pemberhentian ${row[1]} — ${(row[8] ? `${row[8].replaceAll(',', ' — ')} — ` : '')}${row[3]}`)}><Icon name="map" size={17} /></button>}<button className="danger" title="Hapus" onClick={() => requestDelete(i)}><Icon name="trash" size={17} /></button></div></td></tr>)}</tbody></table></div>
    </div>
    {modal && <Modal title={`${modal.mode === 'add' ? 'Tambah' : 'Edit'} ${config.title}`} onClose={() => setModal(null)} wide={type === 'kelola-jadwal'}><div className="modal-form-grid">{config.fields.map((field, index) => <label key={field}>{field}{renderField(field, index)}</label>)}</div><div className="modal-actions"><button className="secondary-btn" onClick={() => setModal(null)}>Batal</button><button className="primary-btn" onClick={save}>Simpan Data</button></div></Modal>}
    {deleteIndex !== null && <Modal title="Hapus Data?" onClose={() => setDeleteIndex(null)}><p className="delete-copy">Data <strong>{rows[deleteIndex][0]}</strong> akan dihapus permanen. Tindakan ini tidak dapat dibatalkan.</p><div className="modal-actions"><button className="secondary-btn" onClick={() => setDeleteIndex(null)}>Batal</button><button className="danger-btn" onClick={() => { updateRows(rows.filter((_, i) => i !== deleteIndex)); setDeleteIndex(null); onToast('Data berhasil dihapus'); }}>Hapus Data</button></div></Modal>}
  </div>;
}
