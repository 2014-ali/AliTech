
import React, { useState } from 'react';
import { Ad, Complaint } from '../../types';
import { ADMIN_CODE } from '../../constants';

interface Props {
  ads: Ad[];
  setAds: (ads: Ad[]) => void;
  complaints: Complaint[];
}

const AdminPanel: React.FC<Props> = ({ ads, setAds, complaints }) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [code, setCode] = useState('');
  const [newAd, setNewAd] = useState({ title: '', content: '', imageUrl: '', country: 'LB' });

  const handleLogin = () => {
    if (code === ADMIN_CODE) setIsAdmin(true);
    else alert("كود المشرف غير صحيح");
  };

  const handleAddAd = () => {
    const ad: Ad = { ...newAd, id: Date.now().toString() };
    const updated = [...ads, ad];
    setAds(updated);
    localStorage.setItem('ymf_ads', JSON.stringify(updated));
    setNewAd({ title: '', content: '', imageUrl: '', country: 'LB' });
  };

  const removeAd = (id: string) => {
    const updated = ads.filter(a => a.id !== id);
    setAds(updated);
    localStorage.setItem('ymf_ads', JSON.stringify(updated));
  };

  if (!isAdmin) {
    return (
      <div className="h-full flex items-center justify-center p-8 bg-stone-900">
        <div className="bg-white p-8 rounded-3xl w-full max-w-sm space-y-6 text-center shadow-2xl">
           <h2 className="text-2xl font-bold text-stone-800">بوابة المشرف</h2>
           <input 
             type="password"
             placeholder="أدخل كود المشرف"
             className="w-full p-4 border rounded-2xl text-center font-bold tracking-widest"
             value={code}
             onChange={(e) => setCode(e.target.value)}
           />
           <button onClick={handleLogin} className="w-full bg-emerald-900 text-white p-4 rounded-2xl font-bold shadow-lg">دخول</button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8 bg-stone-50 min-h-full">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-stone-800">لوحة التحكم</h2>
        <button onClick={() => setIsAdmin(false)} className="text-xs text-red-500 font-bold">تسجيل الخروج</button>
      </div>

      <section className="bg-white p-6 rounded-3xl shadow-sm border border-stone-200 space-y-4">
        <h3 className="font-bold border-b pb-2">إضافة إعلان جديد</h3>
        <input placeholder="عنوان الإعلان" className="w-full p-3 border rounded-xl" value={newAd.title} onChange={e => setNewAd({...newAd, title: e.target.value})} />
        <textarea placeholder="محتوى الإعلان" className="w-full p-3 border rounded-xl" value={newAd.content} onChange={e => setNewAd({...newAd, content: e.target.value})} />
        <input placeholder="رابط الصورة" className="w-full p-3 border rounded-xl" value={newAd.imageUrl} onChange={e => setNewAd({...newAd, imageUrl: e.target.value})} />
        <button onClick={handleAddAd} className="w-full bg-emerald-700 text-white p-3 rounded-xl font-bold">نشر الإعلان</button>
      </section>

      <section className="space-y-4">
        <h3 className="font-bold text-stone-600">الإعلانات النشطة ({ads.length})</h3>
        <div className="grid grid-cols-1 gap-3">
          {ads.map(ad => (
            <div key={ad.id} className="bg-white p-4 rounded-2xl border flex justify-between items-center">
              <div>
                <p className="font-bold text-sm">{ad.title}</p>
                <p className="text-xs text-stone-400">{ad.content}</p>
              </div>
              <button onClick={() => removeAd(ad.id)} className="text-red-500 text-xs font-bold">حذف</button>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <h3 className="font-bold text-stone-600">الشكاوى والنصائح ({complaints.length})</h3>
        <div className="grid grid-cols-1 gap-3">
          {complaints.map(c => (
            <div key={c.id} className="bg-white p-4 rounded-2xl border space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-emerald-800">{c.userName}</span>
                <span className="text-[10px] text-stone-400">{new Date(c.date).toLocaleDateString()}</span>
              </div>
              <p className="text-sm text-stone-700">{c.text}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default AdminPanel;
