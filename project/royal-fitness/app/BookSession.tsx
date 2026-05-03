
{`import { useEffect, useState } from "react";
import {
  ScrollView, Text, View, TouchableOpacity, TextInput,
  Alert, ActivityIndicator, StyleSheet, StatusBar, Image,
} from "react-native";
import { router } from "expo-router";
import { apiRequest } from "../utils/api";
import { getToken } from "../utils/storage";

const TIME_SLOTS = [
  "06:00 AM","07:00 AM","08:00 AM","09:00 AM","10:00 AM",
  "11:00 AM","12:00 PM","01:00 PM","02:00 PM","03:00 PM",
  "04:00 PM","05:00 PM","06:00 PM","07:00 PM","08:00 PM",
];

export default function BookSession() {
  const [trainers, setTrainers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTrainer, setSelectedTrainer] = useState(null);
  const [selectedTime, setSelectedTime] = useState("");
  const [date, setDate] = useState("");
  const [note, setNote] = useState("");
  const [booking, setBooking] = useState(false);
  const [bookedCard, setBookedCard] = useState(null);

  const loadTrainers = async () => {
    setLoading(true);
    try {
      const data = await apiRequest("/users/trainers", "GET");
      setTrainers(Array.isArray(data) ? data : []);
    } catch (e: any) {
      Alert.alert("Error", e.message || "Cannot load trainers");
    } finally {
      setLoading(false);
    }
  };

  const bookSession = async () => {
    if (!selectedTrainer) return Alert.alert("Select a trainer first");
    if (!date.trim()) return Alert.alert("Enter a date (e.g. 2025-06-15)");
    if (!selectedTime) return Alert.alert("Choose a time slot");
    setBooking(true);
    try {
      const token = await getToken();
      await apiRequest("/appointments", "POST", {
        trainerId: selectedTrainer._id,
        date: date.trim(),
        time: selectedTime,
        note: note.trim() || "Training session",
      }, token);
      setBookedCard({
        trainer: selectedTrainer,
        date: date.trim(),
        time: selectedTime,
        note: note.trim() || "Training session",
      });
      Alert.alert(
        "Booked!",
        \`Session with Coach \${selectedTrainer.name} at \${selectedTime} on \${date} requested.\`
      );
    } catch (e: any) {
      Alert.alert("Booking Failed", e.message || "Try again");
    } finally {
      setBooking(false);
    }
  };

  useEffect(() => { loadTrainers(); }, []);

  return (
    
      

      
         router.back()} style={styles.backBtn}>
          ‹
        
        
          Book a Session
          Choose your trainer & time
        
      

      {bookedCard && (
        
          ✅ Session Requested!
          
            
            
              Coach {bookedCard.trainer?.name}
              {bookedCard.trainer?.email}
            
          
          
            
              📅 Date
              {bookedCard.date}
            
            
            
              ⏰ Time
              {bookedCard.time}
            
          
          
            Awaiting trainer approval. You'll see it confirmed in your dashboard.
          
        
      )}

      Available Trainers
      {loading && }
      {!loading && trainers.length === 0 && (
        
          👤
          No trainers found
        
      )}
      {trainers.map((t) => (
         setSelectedTrainer(t)}
          activeOpacity={0.8}
        >
          
          
            Coach {t.name}
            {t.email}
            Available slots:
            
              {["06–08 AM","09–11 AM","02–04 PM","05–07 PM"].map((slot) => (
                
                  {slot}
                
              ))}
            
          
          {selectedTrainer?._id === t._id && (
            ✓
          )}
        
      ))}

      Select Date
      
        
      

      Choose Time Slot
      
        {TIME_SLOTS.map((slot) => (
           setSelectedTime(slot)}
          >
            
              {slot}
            
          
        ))}
      

      Session Note (optional)
      
        
      

      
        {booking
          ? 
          : Confirm Booking
        }
      
    
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: "#F4F5FA", padding: 20 },
  header: {
    marginTop: 55, flexDirection: "row",
    alignItems: "center", gap: 14, marginBottom: 10,
  },
  backBtn: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: "white", alignItems: "center", justifyContent: "center",
  },
  backText: { fontSize: 34, color: "#111827", marginTop: -4 },
  title: { color: "#111827", fontSize: 28, fontWeight: "900" },
  sub: { color: "#6B7280", marginTop: 4 },
  sectionTitle: {
    color: "#111827", fontSize: 18, fontWeight: "900",
    marginTop: 22, marginBottom: 12,
  },
  emptyCard: {
    backgroundColor: "white", padding: 35,
    borderRadius: 24, alignItems: "center",
  },
  emptyIcon: { fontSize: 40 },
  emptyText: { color: "#6B7280", marginTop: 10, fontWeight: "800" },
  confirmedCard: {
    backgroundColor: "#F0FDF4", borderRadius: 26, padding: 20,
    marginBottom: 8, borderLeftWidth: 4, borderLeftColor: "#10B981",
  },
  confirmedTitle: { color: "#065F46", fontSize: 18, fontWeight: "900", marginBottom: 14 },
  confirmedRow: { flexDirection: "row", alignItems: "center", gap: 12 },
  confirmedAvatar: { width: 48, height: 48, borderRadius: 24 },
  confirmedName: { color: "#111827", fontSize: 16, fontWeight: "900" },
  confirmedMeta: { color: "#6B7280", fontSize: 12, marginTop: 3 },
  confirmedTimeRow: {
    flexDirection: "row", backgroundColor: "#DCFCE7",
    borderRadius: 18, padding: 14, marginTop: 14, alignItems: "center",
  },
  confirmedTimeBox: { flex: 1, alignItems: "center" },
  confirmedTimeLabel: { color: "#6B7280", fontSize: 12, fontWeight: "700" },
  confirmedTimeValue: { color: "#065F46", fontSize: 16, fontWeight: "900", marginTop: 4 },
  confirmedTimeDivider: { width: 1, height: 36, backgroundColor: "#A7F3D0" },
  confirmedNote: { color: "#047857", fontSize: 12, marginTop: 12, fontWeight: "700" },
  trainerCard: {
    backgroundColor: "white", borderRadius: 26, padding: 16,
    marginBottom: 14, flexDirection: "row", alignItems: "flex-start",
    gap: 14, borderWidth: 2, borderColor: "transparent",
  },
  trainerCardSelected: { borderColor: "#2563EB", backgroundColor: "#EFF6FF" },
  trainerAvatar: { width: 54, height: 54, borderRadius: 27, marginTop: 2 },
  trainerName: { color: "#111827", fontSize: 17, fontWeight: "900" },
  trainerEmail: { color: "#6B7280", fontSize: 12, marginTop: 3 },
  trainerAvailLabel: { color: "#374151", fontSize: 12, fontWeight: "800", marginTop: 10 },
  availabilityRow: { flexDirection: "row", flexWrap: "wrap", gap: 6, marginTop: 6 },
  availPill: {
    backgroundColor: "#DBEAFE", paddingHorizontal: 10,
    paddingVertical: 4, borderRadius: 999,
  },
  availPillText: { color: "#1D4ED8", fontSize: 11, fontWeight: "800" },
  selectedTick: { color: "#2563EB", fontSize: 22, fontWeight: "900" },
  inputCard: { backgroundColor: "white", borderRadius: 22, padding: 4, marginBottom: 4 },
  textInput: {
    backgroundColor: "#F9FAFB", color: "#111827",
    padding: 14, borderRadius: 18, fontSize: 15,
    borderWidth: 1, borderColor: "#E5E7EB",
  },
  timeSlotsWrap: { flexDirection: "row", flexWrap: "wrap", gap: 10, marginBottom: 4 },
  timeSlot: {
    paddingHorizontal: 16, paddingVertical: 10, borderRadius: 999,
    backgroundColor: "white", borderWidth: 1.5, borderColor: "#E5E7EB",
  },
  timeSlotActive: { backgroundColor: "#2563EB", borderColor: "#2563EB" },
  timeSlotText: { color: "#374151", fontWeight: "800", fontSize: 13 },
  timeSlotTextActive: { color: "#FFFFFF" },
  bookBtn: {
    backgroundColor: "#2563EB", padding: 17,
    borderRadius: 20, marginTop: 24, alignItems: "center",
  },
  bookBtnText: { color: "#FFFFFF", fontWeight: "900", fontSize: 16 },
});`}
