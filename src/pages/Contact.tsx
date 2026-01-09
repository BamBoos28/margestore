// pages/Contact.tsx
import BottomNavbar from "../components/BottomNavbar";
import { useToast } from "../components/ToastProvider";
import { useState, type JSX } from "react";

/** ---------- Types ---------- */
type ProfileItem = {
  iconSrc: string;
  text: string;
  desc: string;
};

export default function Contact(): JSX.Element {
  const { showToast } = useToast();

  /** ---------- Profile Info ---------- */
  const profileItems: ProfileItem[] = [
    { iconSrc: "/phone.svg", text: "Nomer WA", desc: "+6287835394899" },
    {
      iconSrc: "/location.svg",
      text: "Alamat",
      desc: "Desa Margorejo, Kecamatan Margorejo, Kabupaten Pati",
    },
    { iconSrc: "/cs.svg", text: "Pelayanan Online", desc: "24 / 7" },
    { iconSrc: "/time.svg", text: "Pengiriman Barang", desc: "07.00 - 18.00" },
  ];

  /** ---------- Form State ---------- */
  const [nama, setNama] = useState("");
  const [pesan, setPesan] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  /** ---------- Submit Handler ---------- */
  const handleSendMessage = async () => {
    if (!nama.trim() || !pesan.trim()) {
      showToast("Semua field harus diisi.", {
        variant: "error",
        duration: 1800,
      });
      return;
    }

    setIsLoading(true);

    try {
      const webhook = import.meta.env.VITE_API_DC_SARAN;

      const embeds = [
        {
          title: "📩 Pesan / Saran Baru",
          color: 0x22c55e,
          fields: [
            {
              name: "👤 Nama Pengirim",
              value: nama,
              inline: false,
            },
            {
              name: "💬 Pesan",
              value: pesan,
              inline: false,
            },
          ],
          timestamp: new Date().toISOString(),
        },
      ];

      const res = await fetch(webhook, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: null,
          embeds,
        }),
      });

      if (!res.ok) throw new Error("Webhook failed");

      setNama("");
      setPesan("");

      showToast("Pesan berhasil dikirim. Terima kasih!", {
        variant: "success",
        duration: 1800,
      });
    } catch (err) {
      showToast("Gagal mengirim pesan. Coba lagi.", {
        variant: "error",
        duration: 1800,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="bg-light hidden min-h-screen items-center justify-center px-6 xl:flex">
        <div className="max-w-md rounded-xl bg-white p-6 text-center shadow">
          <h1 className="text-primary mb-2 text-xl font-semibold">
            Mobile Only
          </h1>
          <p className="text-main text-sm">
            Aplikasi ini hanya dapat digunakan pada perangkat mobile.
            <br />
            Silakan buka kembali menggunakan smartphone.
          </p>
        </div>
      </div>

      <div className="min-h-screen xl:hidden bg-light pb-24">
        <div className="mx-auto max-w-4xl px-4 py-8 ">
          {/* ---------- Profile Grid ---------- */}
          <section className="mb-6">
            <div className="grid grid-cols-2 gap-2 rounded-lg border border-gray-200 bg-white">
              {profileItems.map((item, idx) => (
                <div
                  key={idx}
                  className="flex flex-col items-center gap-3 px-5 py-8 text-center hover:bg-neutral-100"
                >
                  <img src={item.iconSrc} className="h-14 w-14" />
                  <h3 className="text-sm font-bold uppercase text-main">
                    {item.text}
                  </h3>
                  <p className="text-xs text-slate-600">{item.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* ---------- Contact Form ---------- */}
          <section className="rounded-lg bg-white p-5 shadow">
            <h2 className="mb-4 text-center text-xl font-bold text-main">
              Tinggalkan Pesan
            </h2>

            <div className="space-y-4">
              <input
                value={nama}
                onChange={(e) => setNama(e.target.value)}
                placeholder="Nama Anda"
                className="w-full rounded-md border border-gray-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--action-green)]"
              />

              <textarea
                value={pesan}
                onChange={(e) => setPesan(e.target.value)}
                placeholder="Tulis pesan..."
                className="w-full min-h-[140px] rounded-md border border-gray-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--action-green)]"
              />

              {/* ---------- SUBMIT BUTTON ---------- */}
              <button
                onClick={handleSendMessage}
                disabled={isLoading}
                className={`rounded-md px-5 py-2 text-sm font-semibold text-white shadow 
                ${
                  isLoading
                    ? "cursor-not-allowed bg-gray-400"
                    : "bg-action hover:bg-primary"
                }`}
              >
                {isLoading ? "Processing..." : "Kirim Pesan"}
              </button>
            </div>
          </section>
        </div>

        <BottomNavbar />
      </div>
    </>
  );
}
