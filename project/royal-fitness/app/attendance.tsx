import { useEffect, useState } from 'react';
import {
  ScrollView, View, Text, TouchableOpacity, StyleSheet, Alert, StatusBar,
} from 'react-native';
import { apiRequest } from '../utils/api';
import { getToken, getUser } from '../utils/storage';

const MOCK_HISTORY = [
  { date: '2026-05-01', status: 'Present' }, { date: '2026-05-02', status: 'Present' },
  { date: '2026-05-03', status: 'Absent' },  { date: '2026-05-04', status: 'Present' },
  { date: '2026-05-05', status: 'Present' },
];

export default function AttendanceTab() {
  const [role, setRole] = useState('member');
  const [marked, setMarked] = useState(false);
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  useEffect(() => {
    getUser().then(u => {
      const r = u?.role || 'member';
      setRole(r);
      if (r === 'trainer') loadBookings();
    });
  }, []);

  const loadBookings = async () => {
    setLoading(true);
    try {
      const token = await getToken();
      const data = await apiRequest('/appointments/trainer', 'GET', undefined, token);
      setRequests(Array.isArray(data) ? data : []);
    } catch (e: any) { Alert.alert('Error', e.message); }
    finally { setLoading(false); }
  };

  const updateStatus = async (id: string, status: string) => {
    try {
      const token = await getToken();
      await apiRequest(`/appointments/${id}/status`, 'PUT', { status }, token);
      Alert.alert('Updated', `Booking ${status}`);
      loadBookings();
    } catch (e: any) { Alert.alert('Error', e.message); }
  };

  const present = MOCK_HISTORY.filter(h => h.status === 'Present').length;
  const absent = MOCK_HISTORY.filter(h => h.status === 'Absent').length;

  // ── TRAINER VIEW ───────────────────────────────────────────────
  if (role === 'trainer' || role === 'admin') {
    return (
      <ScrollView style={s.page} contentContainerStyle={{ paddingBottom: 50 }}>
        <StatusBar barStyle="light-content" />
        <View style={s.header}>
          <Text style={s.title}>Booking Requests</Text>
          <Text style={s.sub}>{requests.length} total requests</Text>
        </View>

        {requests.length === 0 && !loading && (
          <View style={s.empty}>
            <Text style={s.emptyIcon}>📋</Text>
            <Text style={s.emptyText}>No booking requests yet</Text>
          </View>
        )}

        {requests.map(r => {
          const statusColor = r.status === 'Approved' ? '#10B981' : r.status === 'Rejected' ? '#EF233C' : '#E3B341';
          const initials = r.member?.name?.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2) || '??';
          return (
            <View key={r._id} style={s.card}>
              <View style={s.reqTop}>
                <View style={[s.avatar, { backgroundColor: '#06B6D418', borderColor: '#06B6D445' }]}>
                  <Text style={[s.avatarText, { color: '#06B6D4' }]}>{initials}</Text>
                </View>
                <View style={s.memberInfo}>
                  <Text style={s.memberName}>{r.member?.name || 'Unknown'}</Text>
                  <Text style={s.memberEmail}>{r.member?.email}</Text>
                </View>
                <View style={[s.statusBadge, { backgroundColor: statusColor + '18', borderColor: statusColor + '45' }]}>
                  <Text style={[s.statusText, { color: statusColor }]}>{r.status || 'Pending'}</Text>
                </View>
              </View>
              <View style={s.pills}>
                {r.date && <View style={s.pill}><Text style={s.pillText}>📅 {r.date}</Text></View>}
                {r.time && <View style={s.pill}><Text style={s.pillText}>🕐 {r.time}</Text></View>}
              </View>
              {r.note && <Text style={s.note}>"{r.note}"</Text>}
              {(!r.status || r.status === 'Pending') && (
                <View style={s.btnRow}>
                  <TouchableOpacity onPress={() => updateStatus(r._id, 'Approved')}
                    style={[s.approveBtn, { flex: 1 }]}>
                    <Text style={s.approveBtnText}>✓ Approve</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => updateStatus(r._id, 'Rejected')}
                    style={[s.rejectBtn, { flex: 1 }]}>
                    <Text style={s.rejectBtnText}>✕ Reject</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          );
        })}
      </ScrollView>
    );
  }

  // ── MEMBER VIEW ────────────────────────────────────────────────
  return (
    <ScrollView style={s.page} contentContainerStyle={{ paddingBottom: 50 }}>
      <StatusBar barStyle="light-content" />
      <View style={s.header}>
        <Text style={s.title}>Attendance</Text>
        <Text style={s.sub}>{today}</Text>
      </View>

      {/* Stats */}
      <View style={s.statsRow}>
        <View style={[s.statCard, { borderColor: '#10B98140' }]}>
          <Text style={[s.statVal, { color: '#10B981' }]}>{present}</Text>
          <Text style={s.statLabel}>Present</Text>
        </View>
        <View style={[s.statCard, { borderColor: '#EF233C40' }]}>
          <Text style={[s.statVal, { color: '#EF233C' }]}>{absent}</Text>
          <Text style={s.statLabel}>Absent</Text>
        </View>
        <View style={[s.statCard, { borderColor: '#3B82F640' }]}>
          <Text style={[s.statVal, { color: '#3B82F6' }]}>
            {Math.round((present / (present + absent)) * 100)}%
          </Text>
          <Text style={s.statLabel}>Rate</Text>
        </View>
      </View>

      {/* Mark Today */}
      <View style={s.markCard}>
        <Text style={s.markDate}>Today — {today}</Text>
        <Text style={[s.markStatus, { color: marked ? '#10B981' : '#6B7280' }]}>
          {marked ? '✅ Marked Present' : '⏳ Not Yet Marked'}
        </Text>
        <TouchableOpacity
          disabled={marked}
          onPress={() => { setMarked(true); Alert.alert('✅ Done', 'Attendance marked as Present!'); }}
          style={[s.markBtn, marked && { backgroundColor: '#21262D' }]}
        >
          <Text style={[s.markBtnText, marked && { color: '#6B7280' }]}>
            {marked ? 'Already Marked' : 'Mark Present'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* History */}
      <Text style={s.histTitle}>Recent History</Text>
      {MOCK_HISTORY.slice().reverse().map((item, i) => (
        <View key={i} style={s.histCard}>
          <View style={s.histLeft}>
            <Text style={s.histDate}>{item.date}</Text>
          </View>
          <View style={[s.histBadge, {
            backgroundColor: item.status === 'Present' ? '#10B98118' : '#EF233C18',
            borderColor: item.status === 'Present' ? '#10B98140' : '#EF233C40',
          }]}>
            <Text style={[s.histStatus, { color: item.status === 'Present' ? '#10B981' : '#EF233C' }]}>
              {item.status === 'Present' ? '✓ Present' : '✕ Absent'}
            </Text>
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

const s = StyleSheet.create({
  page: { flex: 1, backgroundColor: '#05070B' },
  header: { paddingHorizontal: 20, paddingTop: 60, paddingBottom: 16 },
  title: { color: '#F0F6FC', fontSize: 28, fontWeight: '900', letterSpacing: -0.5 },
  sub: { color: '#6B7280', fontSize: 13, marginTop: 3 },
  statsRow: { flexDirection: 'row', gap: 12, paddingHorizontal: 20, marginBottom: 16 },
  statCard: {
    flex: 1, backgroundColor: '#0D1117', borderWidth: 1,
    borderRadius: 16, padding: 16, alignItems: 'center',
  },
  statVal: { fontSize: 28, fontWeight: '900', letterSpacing: -1 },
  statLabel: { color: '#8B949E', fontSize: 12, marginTop: 4 },
  markCard: {
    backgroundColor: '#0D1117', borderWidth: 1, borderColor: '#21262D',
    borderRadius: 18, padding: 22, marginHorizontal: 20, marginBottom: 24, alignItems: 'center',
  },
  markDate: { color: '#8B949E', fontSize: 14, marginBottom: 10 },
  markStatus: { fontSize: 20, fontWeight: '800', marginBottom: 18 },
  markBtn: { backgroundColor: '#EF233C', paddingVertical: 15, paddingHorizontal: 40, borderRadius: 14 },
  markBtnText: { color: '#fff', fontWeight: '900', fontSize: 16 },
  histTitle: { color: '#8B949E', fontSize: 11, fontWeight: '700', letterSpacing: 2, marginBottom: 12, marginLeft: 20 },
  histCard: {
    backgroundColor: '#0D1117', borderWidth: 1, borderColor: '#21262D',
    borderRadius: 14, padding: 16, marginHorizontal: 20, marginBottom: 10,
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
  },
  histLeft: {},
  histDate: { color: '#F0F6FC', fontSize: 15, fontWeight: '700' },
  histBadge: { borderWidth: 1, paddingHorizontal: 12, paddingVertical: 5, borderRadius: 20 },
  histStatus: { fontSize: 12, fontWeight: '800' },
  empty: { alignItems: 'center', paddingTop: 80 },
  emptyIcon: { fontSize: 52, marginBottom: 14 },
  emptyText: { color: '#6B7280', fontSize: 16 },
  card: {
    backgroundColor: '#0D1117', borderWidth: 1, borderColor: '#21262D',
    borderRadius: 18, padding: 18, marginHorizontal: 20, marginBottom: 14,
  },
  reqTop: { flexDirection: 'row', alignItems: 'center', marginBottom: 14 },
  avatar: { width: 46, height: 46, borderRadius: 23, borderWidth: 1, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  avatarText: { fontSize: 15, fontWeight: '900' },
  memberInfo: { flex: 1 },
  memberName: { color: '#F0F6FC', fontSize: 16, fontWeight: '800' },
  memberEmail: { color: '#8B949E', fontSize: 12, marginTop: 2 },
  statusBadge: { borderWidth: 1, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  statusText: { fontSize: 11, fontWeight: '800' },
  pills: { flexDirection: 'row', gap: 10, marginBottom: 10 },
  pill: {
    backgroundColor: '#161B22', borderWidth: 1, borderColor: '#21262D',
    paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20,
  },
  pillText: { color: '#C9D1D9', fontSize: 12, fontWeight: '600' },
  note: { color: '#8B949E', fontSize: 13, fontStyle: 'italic', marginBottom: 14 },
  btnRow: { flexDirection: 'row', gap: 10 },
  approveBtn: { backgroundColor: '#10B98118', borderWidth: 1, borderColor: '#10B98145', borderRadius: 12, padding: 13, alignItems: 'center' },
  approveBtnText: { color: '#10B981', fontWeight: '800', fontSize: 14 },
  rejectBtn: { backgroundColor: '#EF233C18', borderWidth: 1, borderColor: '#EF233C45', borderRadius: 12, padding: 13, alignItems: 'center' },
  rejectBtnText: { color: '#EF233C', fontWeight: '800', fontSize: 14 },
});