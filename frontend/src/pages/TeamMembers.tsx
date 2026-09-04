import { Users, Shield, MoreVertical } from 'lucide-react';

export default function TeamMembers() {
  const members = [
    { name: 'Lochit Vinay', email: 'lochit@razorpay.build', role: 'Admin', status: 'Active' },
    { name: 'AI System User', email: 'agent@razorpay.build', role: 'System Agent', status: 'Active' },
    { name: 'Jane Doe', email: 'jane@merchant.co', role: 'Finance Analyst', status: 'Invited' },
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Team Members</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage access control and human escalations.</p>
        </div>
        <button className="px-4 py-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-medium rounded-lg text-sm hover:scale-[1.02] transition-transform">
          Invite Member
        </button>
      </div>

      <div className="bg-white/80 dark:bg-gray-800/60 backdrop-blur-xl rounded-xl shadow-md border border-white/40 dark:border-gray-700/50 mt-6">
        <ul className="divide-y divide-gray-100 dark:divide-gray-700/50">
          {members.map((member, idx) => (
            <li key={idx} className="p-6 flex items-center justify-between hover:bg-gray-50/50 dark:hover:bg-gray-700/20 transition-colors">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold">
                  {member.name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-900 dark:text-white">{member.name}</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{member.email}</p>
                </div>
              </div>
              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
                  <Shield className="w-4 h-4 text-gray-400" />
                  <span>{member.role}</span>
                </div>
                <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${member.status === 'Active' ? 'bg-green-500/10 text-green-500' : 'bg-gray-500/10 text-gray-500'}`}>
                  {member.status}
                </span>
                <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                  <MoreVertical className="w-5 h-5" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
