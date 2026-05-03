import { useState } from "react";
import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  View,
  Image,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { apiRequest } from "../utils/api";

const fitnessGoals = [
  "Lose Weight",
  "Muscle Gain",
  "Get Fitter",
  "Build Strength",
  "Flexibility",
  "General Fitness",
];

const specializations = [
  "Weight Training",
  "Cardio Fitness",
  "Yoga",
  "Personal Training",
  "Strength Training",
  "CrossFit",
  "Nutrition Coaching",
];

const supplyTypes = [
  "Protein Supplements",
  "Vitamins",
  "Gym Equipment",
  "Energy Drinks",
  "Accessories",
];

const memberships = ["Monthly", "Yearly", "Premium"];

export default function Register() {
  const params = useLocalSearchParams();
  const role = String(params.role || "member");

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "123456",
    profileImage: "",
    fitnessGoal: "General Fitness",
    membershipType: "Monthly",
    age: "18",
    gender: "male",
    address: "",
    specialization: "Weight Training",
    experience: "1",
    from: "08:00",
    to: "17:00",
    companyName: "",
    supplyType: "Protein Supplements",
  });

  const selectValue = (field: string, value: string) => {
    setForm({ ...form, [field]: value });
  };

  const register = async () => {
    if (form.name.trim().length < 3) {
      return Alert.alert("Validation", "Name minimum 3 characters");
    }

    if (!form.email.includes("@")) {
      return Alert.alert("Validation", "Enter valid email");
    }

    if (!/^0\d{9}$/.test(form.phone)) {
      return Alert.alert("Validation", "Phone must start with 0 and have 10 digits");
    }

    if (form.password.length < 6) {
      return Alert.alert("Validation", "Password minimum 6 characters");
    }

    const body: any = {
      name: form.name,
      email: form.email,
      phone: form.phone,
      password: form.password,
      role,
      profileImage: form.profileImage,
    };

    if (role === "member") {
      body.fitnessGoal = form.fitnessGoal;
      body.membershipType = form.membershipType.toLowerCase();
      body.age = Number(form.age) || 18;
      body.gender = form.gender;
      body.address = form.address || "Not provided";
    }

    if (role === "trainer") {
      body.specialization = form.specialization;
      body.experience = Number(form.experience) || 1;
      body.from = form.from;
      body.to = form.to;
      body.photoUrl =
        form.profileImage ||
        "https://cdn-icons-png.flaticon.com/512/3135/3135715.png";
    }

    if (role === "supplier") {
      body.companyName = form.companyName || "Royal Fitness Supplier";
      body.supplyType = form.supplyType;
      body.address = form.address || "Not provided";
    }

    try {
      await apiRequest("/auth/register", "POST", body);
      Alert.alert("Success", "Account created successfully");
      router.replace({ pathname: "/login", params: { role } });
    } catch (error: any) {
      Alert.alert("Register Failed", error.message);
    }
  };

  return (
    <ScrollView style={styles.page} showsVerticalScrollIndicator={false}>
      <View style={styles.hero}>
        <Text style={styles.brand}>ROYAL FITNESS</Text>
        <Text style={styles.title}>{role.toUpperCase()} REGISTER</Text>
        <Text style={styles.sub}>Create your premium fitness profile</Text>

        <View style={styles.avatarBox}>
          <Image
            source={{
              uri:
                form.profileImage.trim() !== ""
                  ? form.profileImage
                  : "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
            }}
            style={styles.avatar}
          />
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.section}>Basic Details</Text>

        <Input
          label="Full Name"
          value={form.name}
          onChangeText={(v: string) => setForm({ ...form, name: v })}
        />

        <Input
          label="Email"
          value={form.email}
          onChangeText={(v: string) => setForm({ ...form, email: v })}
        />

        <Input
          label="Phone"
          value={form.phone}
          keyboardType="phone-pad"
          onChangeText={(v: string) => setForm({ ...form, phone: v })}
        />

        <Input
          label="Password"
          value={form.password}
          secureTextEntry={true}
          onChangeText={(v: string) => setForm({ ...form, password: v })}
        />

        <Input
          label="Profile Photo URL"
          value={form.profileImage}
          onChangeText={(v: string) => setForm({ ...form, profileImage: v })}
        />
      </View>

      {role === "member" && (
        <View style={styles.card}>
          <Text style={styles.section}>Member Fitness Setup</Text>

          <Text style={styles.label}>Fitness Goal</Text>
          <ChipGroup
            data={fitnessGoals}
            selected={form.fitnessGoal}
            onSelect={(v: string) => selectValue("fitnessGoal", v)}
          />

          <Text style={styles.label}>Membership Type</Text>
          <ChipGroup
            data={memberships}
            selected={form.membershipType}
            onSelect={(v: string) => selectValue("membershipType", v)}
          />

          <Input
            label="Age"
            value={form.age}
            keyboardType="numeric"
            onChangeText={(v: string) => setForm({ ...form, age: v })}
          />

          <Input
            label="Address"
            value={form.address}
            onChangeText={(v: string) => setForm({ ...form, address: v })}
          />

          <View style={styles.infoBox}>
            <Text style={styles.infoTitle}>Attendance Feature</Text>
            <Text style={styles.infoText}>
              After login, members can mark their own daily attendance as Present.
            </Text>
          </View>
        </View>
      )}

      {role === "trainer" && (
        <View style={styles.card}>
          <Text style={styles.section}>Trainer Professional Setup</Text>

          <Text style={styles.label}>Specialization</Text>
          <ChipGroup
            data={specializations}
            selected={form.specialization}
            onSelect={(v: string) => selectValue("specialization", v)}
          />

          <Input
            label="Experience Years"
            value={form.experience}
            keyboardType="numeric"
            onChangeText={(v: string) => setForm({ ...form, experience: v })}
          />

          <View style={styles.row}>
            <View style={{ flex: 1 }}>
              <Input
                label="From"
                value={form.from}
                onChangeText={(v: string) => setForm({ ...form, from: v })}
              />
            </View>
            <View style={{ width: 12 }} />
            <View style={{ flex: 1 }}>
              <Input
                label="To"
                value={form.to}
                onChangeText={(v: string) => setForm({ ...form, to: v })}
              />
            </View>
          </View>
        </View>
      )}

      {role === "supplier" && (
        <View style={styles.card}>
          <Text style={styles.section}>Supplier Business Setup</Text>

          <Input
            label="Company Name"
            value={form.companyName}
            onChangeText={(v: string) => setForm({ ...form, companyName: v })}
          />

          <Text style={styles.label}>Supply Type</Text>
          <ChipGroup
            data={supplyTypes}
            selected={form.supplyType}
            onSelect={(v: string) => selectValue("supplyType", v)}
          />

          <Input
            label="Business Address"
            value={form.address}
            onChangeText={(v: string) => setForm({ ...form, address: v })}
          />
        </View>
      )}

      <TouchableOpacity style={styles.createBtn} onPress={register}>
        <Text style={styles.createText}>Create Account</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.back()}>
        <Text style={styles.backText}>Back to Login</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

function Input(props: any) {
  return (
    <View style={{ marginBottom: 15 }}>
      <Text style={styles.label}>{props.label}</Text>
      <TextInput
        placeholder={props.label}
        placeholderTextColor="#6B7280"
        value={props.value}
        secureTextEntry={props.secureTextEntry || false}
        keyboardType={props.keyboardType || "default"}
        autoCapitalize="none"
        onChangeText={props.onChangeText}
        style={styles.input}
      />
    </View>
  );
}

function ChipGroup({ data, selected, onSelect }: any) {
  return (
    <View style={styles.chipWrap}>
      {data.map((item: string) => (
        <TouchableOpacity
          key={item}
          onPress={() => onSelect(item)}
          style={[
            styles.chip,
            selected === item && styles.chipActive,
          ]}
        >
          <Text
            style={[
              styles.chipText,
              selected === item && styles.chipTextActive,
            ]}
          >
            {item}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles: any = {
  page: {
    flex: 1,
    backgroundColor: "#05070B",
    padding: 20,
  },
  hero: {
    marginTop: 55,
    alignItems: "center",
    marginBottom: 20,
  },
  brand: {
    color: "#EF233C",
    fontSize: 14,
    letterSpacing: 3,
    fontWeight: "900",
  },
  title: {
    color: "white",
    fontSize: 30,
    fontWeight: "900",
    marginTop: 8,
  },
  sub: {
    color: "#9CA3AF",
    marginTop: 8,
    textAlign: "center",
  },
  avatarBox: {
    marginTop: 22,
    width: 112,
    height: 112,
    borderRadius: 56,
    backgroundColor: "#111827",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#EF233C",
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  card: {
    backgroundColor: "#111827",
    borderRadius: 24,
    padding: 18,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: "#1F2937",
  },
  section: {
    color: "white",
    fontSize: 20,
    fontWeight: "900",
    marginBottom: 15,
  },
  label: {
    color: "#D1D5DB",
    fontSize: 13,
    fontWeight: "700",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#05070B",
    color: "white",
    padding: 15,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#1F2937",
  },
  chipWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 16,
  },
  chip: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 999,
    backgroundColor: "#05070B",
    borderWidth: 1,
    borderColor: "#374151",
  },
  chipActive: {
    backgroundColor: "#EF233C",
    borderColor: "#EF233C",
  },
  chipText: {
    color: "#9CA3AF",
    fontWeight: "700",
  },
  chipTextActive: {
    color: "white",
  },
  row: {
    flexDirection: "row",
  },
  infoBox: {
    backgroundColor: "#05070B",
    padding: 15,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#374151",
    marginTop: 5,
  },
  infoTitle: {
    color: "#38BDF8",
    fontWeight: "900",
    marginBottom: 6,
  },
  infoText: {
    color: "#D1D5DB",
    lineHeight: 20,
  },
  createBtn: {
    backgroundColor: "#EF233C",
    padding: 17,
    borderRadius: 18,
    marginBottom: 16,
  },
  createText: {
    color: "white",
    textAlign: "center",
    fontWeight: "900",
    fontSize: 16,
  },
  backText: {
    color: "#9CA3AF",
    textAlign: "center",
    marginBottom: 40,
  },
};