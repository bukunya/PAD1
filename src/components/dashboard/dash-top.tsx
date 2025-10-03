import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { FileText, User, Calendar, AlertCircle } from "lucide-react";
import { useSession } from "next-auth/react";

const dataDsn = [
  {
    icon: FileText,
    number: 5,
    desc: "Ujian Mendatang",
  },
  {
    icon: User,
    number: 12,
    desc: "Mahasiswa Dibimbing",
  },
  {
    icon: Calendar,
    number: 8,
    desc: "Ujian Selesai Bulan Ini",
  },
  {
    icon: AlertCircle,
    number: 3,
    desc: "Jadwal Ujian Ditunda",
  },
];

const dataMhs = [
  {
    icon: User,
    number: 5,
    desc: "Ujian Mendatang",
  },
  {
    icon: User,
    number: 12,
    desc: "Mahasiswa Dibimbing",
  },
];

const dataAdm = [
  {
    icon: User,
    number: 20,
    desc: "Mahasiswa Aktif",
  },
  {
    icon: User,
    number: 15,
    desc: "Dosen Aktif",
  },
  {
    icon: User,
    number: 10,
    desc: "Jadwal Ujian Terdekat",
  },
  {
    icon: User,
    number: 5,
    desc: "Ujian Selesai Bulan Ini",
  },
];

function DashboardTop() {
  const { data: session, status } = useSession();
  if (status === "loading" || !session) {
    return (
      <Card className="h-full">
        <CardContent className="flex items-center justify-center">
          <p className="font-medium">Mengambil Data...</p>
        </CardContent>
      </Card>
    );
  }
  const role = session.user?.role;
  let buildingData;
  if (role === "MAHASISWA") {
    buildingData = dataMhs;
  } else if (role === "DOSEN") {
    buildingData = dataDsn;
  } else if (role === "ADMIN") {
    buildingData = dataAdm;
  } else {
    buildingData = dataMhs; // default to mahasiswa if role is undefined
  }
  return (
    <>
      <div className="min-h-[60vh] grid grid-cols-1 md:grid-cols-3 gap-4 md:min-h-min">
        <div className="md:col-span-2">
          <Card className="h-full">
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {buildingData.map((item, index) => {
                  const colorMap = [
                    {
                      bg: "bg-[#E9E6FF]",
                      icon: "text-[#7C5AF3]",
                    },
                    {
                      bg: "bg-[#E6F3FF]",
                      icon: "text-[#4BA3E7]",
                    },
                    {
                      bg: "bg-[#FFF6E6]",
                      icon: "text-[#F3B55A]",
                    },
                    {
                      bg: "bg-[#F9E6FF]",
                      icon: "text-[#D46AFF]",
                    },
                  ];
                  const color = colorMap[index % colorMap.length];
                  return (
                    <div
                      key={index}
                      className="bg-white p-4 rounded-xl flex items-center gap-4 shadow-sm"
                    >
                      <div
                        className={`w-12 h-12 flex items-center justify-center rounded-lg ${color.bg}`}
                      >
                        <item.icon className={`w-6 h-6 ${color.icon}`} />
                      </div>
                      <div className="flex flex-col justify-center">
                        <span className="text-lg font-bold text-gray-900">
                          {item.number}
                        </span>
                        <span className="text-base font-medium text-gray-700">
                          {item.desc}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Recent Activity</h4>
                <ul className="space-y-2 text-sm">
                  <li>• Submitted project proposal for Q4</li>
                  <li>• Reviewed 3 team submissions</li>
                  <li>• Updated project timeline</li>
                  <li>• Scheduled team meeting for Friday</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="md:col-span-1">
          <Card className="h-full">
            <CardContent className="space-y-3">
              <div className="border-l-4 border-purple-500 pl-3">
                <p className="font-semibold">Deadline: Q4 Report</p>
                <p className="text-sm text-muted-foreground">Dec 31, 5:00 PM</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
export default DashboardTop;
