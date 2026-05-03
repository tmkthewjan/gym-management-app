import { useEffect, useMemo, useState } from "react";
import {
  ScrollView,
  Text,
  View,
  TouchableOpacity,
  Alert,
  Image,
  ActivityIndicator,
  TextInput,
  StyleSheet,
  StatusBar,
} from "react-native";
import { router } from "expo-router";
import { apiRequest } from "../utils/api";
import { getToken } from "../utils/storage";

const filters = ["All", "Strength", "Cardio", "Yoga", "CrossFit", "Nutrition"];

export default function Trainers() {
  const [trainers, setTrainers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");

  const loadTrainers = async () => {
    try {
      const data = await apiRequest("/trainers", "GET");
      setTrainers(Array.isArray(data) ? data : []);
    } catch (error: any) {
      Alert.alert("Error", error.message || "Cannot load trainers");
    } finally {
      setLoading(false);
    }
  };

  const bookTrainer = async (trainerId: string, name: string) => {
    try {
      const token = await getToken();

      if (!token) {
        Alert.alert("Login Required", "Please login again");
        return;
      }

      await apiRequest(
        "/appointments",
        "POST",
        {
          trainer: trainerId,
          date: new Date().toISOString().split("T")[0],
          time: "10:00",
          note: "Need fitness training session",
        },
        token
      );

      Alert.alert("Booking Sent", `Appointment request sent to ${name}`);
    } catch (error: any) {
      Alert.alert("Booking Failed", error.message || "Booking failed");
    }
  };

  useEffect(() => {
    loadTrainers();
  }, []);

  const filteredTrainers = useMemo(() => {
    return trainers.filter((t) => {
      const name = t.name?.toLowerCase() || "";
      const spec = (t.specialization || t.spec || "").toLowerCase();

      const matchSearch =
        name.includes(search.toLowerCase()) ||
        spec.includes(search.toLowerCase());

      const matchFilter =
        activeFilter === "All" ||
        spec.includes(activeFilter.toLowerCase());

      return matchSearch && matchFilter;
    });
  }, [trainers, search, activeFilter]);

  return (
    <ScrollView style={styles.page} showsVerticalScrollIndicator={false}>
      <StatusBar barStyle="dark-content" />

      <View style={styles.header}>
        <TouchableOpacity style={styles.backCircle} onPress={() => router.back()}>
          <Text style={styles.backIcon}>‹</Text>
        </TouchableOpacity>

        <View>
          <Text style={styles.title}>Find Your Coach</Text>
          <Text style={styles.sub}>Book expert trainers for your goal</Text>
        </View>
      </View>

      <View style={styles.searchBox}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          placeholder="Search trainer or specialization"
          placeholderTextColor="#9CA3AF"
          value={search}
          onChangeText={setSearch}
          style={styles.searchInput}
        />
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterRow}>
        {filters.map((item) => (
          <TouchableOpacity
            key={item}
            onPress={() => setActiveFilter(item)}
            style={[
              styles.filterChip,
              activeFilter === item && styles.filterChipActive,
            ]}
          >
            <Text
              style={[
                styles.filterText,
                activeFilter === item && styles.filterTextActive,
              ]}
            >
              {item}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={styles.summaryCard}>
        <View>
          <Text style={styles.summaryTitle}>Available Trainers</Text>
          <Text style={styles.summarySub}>
            {filteredTrainers.length} coaches matched your search
          </Text>
        </View>
        <Text style={styles.summaryIcon}>🏋️</Text>
      </View>

      {loading && (
        <ActivityIndicator color="#2563EB" size="large" style={{ marginTop: 40 }} />
      )}

      {!loading && filteredTrainers.length === 0 && (
        <View style={styles.emptyBox}>
          <Text style={styles.emptyIcon}>💪</Text>
          <Text style={styles.emptyText}>No trainers found</Text>
        </View>
      )}

      {filteredTrainers.map((trainer) => {
        const photo =
          trainer.photoUrl && trainer.photoUrl.trim() !== ""
            ? trainer.photoUrl
            : "https://cdn-icons-png.flaticon.com/512/3135/3135715.png";

        const specialization =
          trainer.specialization || trainer.spec || "Fitness Trainer";

        const experience = trainer.experience || trainer.exp || 0;
        const price = trainer.price || trainer.rate || 2500;

        return (
          <View key={trainer._id} style={styles.card}>
            <Image source={{ uri: photo }} style={styles.image} />

            <View style={{ flex: 1 }}>
              <View style={styles.rowBetween}>
                <Text style={styles.name}>{trainer.name}</Text>
                <View style={styles.rating}>
                  <Text style={styles.ratingText}>⭐ 4.8</Text>
                </View>
              </View>

              <Text style={styles.spec}>{specialization}</Text>

              <View style={styles.badgeRow}>
                <Badge text={`${experience} yrs`} />
                <Badge text={`Rs. ${price}/hr`} />
                <Badge text={trainer.available ? "Available" : "Unavailable"} />
              </View>

              <Text style={styles.time}>
                🕒 {trainer.from || "08:00"} - {trainer.to || "17:00"}
              </Text>

              <TouchableOpacity
                disabled={!trainer.available}
                onPress={() => bookTrainer(trainer._id, trainer.name)}
                style={[
                  styles.bookBtn,
                  !trainer.available && { backgroundColor: "#9CA3AF" },
                ]}
              >
                <Text style={styles.bookText}>
                  {trainer.available ? "Book Appointment" : "Not Available"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        );
      })}
    </ScrollView>
  );
}

function Badge({ text }: any) {
  return (
    <View style={styles.badge}>
      <Text style={styles.badgeText}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: "#F4F5FA",
    padding: 20,
  },
  header: {
    marginTop: 55,
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
  },
  backCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },
  backIcon: {
    fontSize: 34,
    color: "#111827",
    marginTop: -4,
  },
  title: {
    color: "#111827",
    fontSize: 30,
    fontWeight: "900",
  },
  sub: {
    color: "#6B7280",
    marginTop: 4,
  },
  searchBox: {
    backgroundColor: "#FFFFFF",
    marginTop: 24,
    borderRadius: 22,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
  },
  searchIcon: {
    fontSize: 18,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    color: "#111827",
    paddingVertical: 16,
    fontSize: 15,
  },
  filterRow: {
    marginTop: 18,
    marginBottom: 18,
  },
  filterChip: {
    backgroundColor: "#FFFFFF",
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 999,
    marginRight: 10,
  },
  filterChipActive: {
    backgroundColor: "#2563EB",
  },
  filterText: {
    color: "#6B7280",
    fontWeight: "800",
  },
  filterTextActive: {
    color: "#FFFFFF",
  },
  summaryCard: {
    backgroundColor: "#111827",
    padding: 20,
    borderRadius: 26,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  summaryTitle: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "900",
  },
  summarySub: {
    color: "#9CA3AF",
    marginTop: 6,
  },
  summaryIcon: {
    fontSize: 38,
  },
  emptyBox: {
    backgroundColor: "#FFFFFF",
    padding: 35,
    borderRadius: 24,
    alignItems: "center",
  },
  emptyIcon: {
    fontSize: 45,
  },
  emptyText: {
    color: "#6B7280",
    marginTop: 10,
    fontWeight: "800",
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 26,
    padding: 16,
    flexDirection: "row",
    gap: 15,
    marginBottom: 16,
  },
  image: {
    width: 95,
    height: 125,
    borderRadius: 22,
    backgroundColor: "#E5E7EB",
  },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  name: {
    color: "#111827",
    fontSize: 20,
    fontWeight: "900",
    flex: 1,
  },
  rating: {
    backgroundColor: "#FEF3C7",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
  },
  ratingText: {
    color: "#B45309",
    fontSize: 11,
    fontWeight: "900",
  },
  spec: {
    color: "#6B7280",
    marginTop: 5,
    fontWeight: "700",
  },
  badgeRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    marginTop: 10,
  },
  badge: {
    backgroundColor: "#EFF6FF",
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 999,
  },
  badgeText: {
    color: "#2563EB",
    fontSize: 11,
    fontWeight: "900",
  },
  time: {
    color: "#374151",
    marginTop: 10,
    fontSize: 13,
    fontWeight: "700",
  },
  bookBtn: {
    backgroundColor: "#2563EB",
    padding: 12,
    borderRadius: 15,
    marginTop: 12,
  },
  bookText: {
    color: "#FFFFFF",
    textAlign: "center",
    fontWeight: "900",
  },
});