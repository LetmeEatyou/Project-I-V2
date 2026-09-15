import React, { useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Pressable,
  Platform,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";

type SlotType = "pending" | "late" | "ontime";

type Slot = {
  id: number;
  name: string;
  target: string;
  logged: string;
  badge: string;
  type: SlotType;
};

const initialSlots: Slot[] = [
  {
    id: 1,
    name: "Fajr Block",
    target: "05:00",
    logged: "—:--",
    badge: "Pending",
    type: "pending",
  },
  {
    id: 2,
    name: "Work Hours Discipline",
    target: "09:00",
    logged: "17:04",
    badge: "+484m Late",
    type: "late",
  },
  {
    id: 3,
    name: "Evening Block",
    target: "19:30",
    logged: "17:04",
    badge: "On Time",
    type: "ontime",
  },
  {
    id: 4,
    name: "Night Block",
    target: "21:30",
    logged: "—:--",
    badge: "Pending",
    type: "pending",
  },
];

const MONTHS = [
  "JANUARY",
  "FEBRUARY",
  "MARCH",
  "APRIL",
  "MAY",
  "JUNE",
  "JULY",
  "AUGUST",
  "SEPTEMBER",
  "OCTOBER",
  "NOVEMBER",
  "DECEMBER",
];

const WEEKDAYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

export default function Index() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const goToPreviousDay = () => {
    const previous = new Date(selectedDate);
    previous.setDate(previous.getDate() - 1);
    setSelectedDate(previous);
  };

  const goToNextDay = () => {
    const next = new Date(selectedDate);
    next.setDate(next.getDate() + 1);
    setSelectedDate(next);
  };

  const handleDateChange = (_event: any, date?: Date) => {
    setShowDatePicker(false);

    if (date) {
      setSelectedDate(date);
    }
  };

  const dayNumber = selectedDate.getDate();
  const month = MONTHS[selectedDate.getMonth()];
  const weekday = WEEKDAYS[selectedDate.getDay()];
  const year = selectedDate.getFullYear();

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {/* HEADER */}

        <View style={styles.header}>
          <View>
            <Text style={styles.eyebrow}>
              PERSONAL COMMAND CENTER
            </Text>

            <Text style={styles.title}>Project I</Text>
          </View>

          <Pressable style={styles.settingsButton}>
            <Text style={styles.settingsIcon}>⚙</Text>
          </Pressable>
        </View>

        {/* DATE */}

        <Pressable
          style={styles.dayCard}
          onPress={() => setShowDatePicker(true)}
        >
          <View>
            <Text style={styles.dayEyebrow}>CURRENT DATE</Text>

            <View style={styles.dayTitleRow}>
              <Text style={styles.dayNumber}>{dayNumber}</Text>

              <View>
                <Text style={styles.dayMonth}>
                  {month} {year}
                </Text>

                <Text style={styles.dayName}>{weekday}</Text>
              </View>
            </View>
          </View>

          <View style={styles.dayArrows}>
            <Pressable
              style={styles.arrowButton}
              onPress={(event) => {
                event.stopPropagation();
                goToPreviousDay();
              }}
            >
              <Text style={styles.arrow}>‹</Text>
            </Pressable>

            <Pressable
              style={styles.arrowButton}
              onPress={(event) => {
                event.stopPropagation();
                goToNextDay();
              }}
            >
              <Text style={styles.arrow}>›</Text>
            </Pressable>
          </View>
        </Pressable>

        {/* NATIVE DATE PICKER */}

        {showDatePicker && (
          <DateTimePicker
            value={selectedDate}
            mode="date"
            display={Platform.OS === "ios" ? "spinner" : "default"}
            onChange={handleDateChange}
          />
        )}

        {/* CURRENT FOCUS */}

        <View style={styles.focusCard}>
          <View style={styles.focusHeader}>
            <Text style={styles.sectionLabel}>
              CURRENT FOCUS
            </Text>

            <View style={styles.activeBadge}>
              <View style={styles.activeDot} />
              <Text style={styles.activeText}>ACTIVE</Text>
            </View>
          </View>

          <Text style={styles.focusTitle}>
            Work Hours Discipline
          </Text>

          <Text style={styles.focusSubtitle}>
            Stay focused. Follow the plan.
          </Text>

          <View style={styles.progressTrack}>
            <View style={styles.progressFill} />
          </View>

          <View style={styles.progressInfo}>
            <Text style={styles.mutedText}>72% COMPLETE</Text>

            <Text style={styles.strongText}>
              48 MIN REMAINING
            </Text>
          </View>
        </View>

        {/* SCHEDULE HEADER */}

        <View style={styles.scheduleHeader}>
          <View>
            <Text style={styles.scheduleTitle}>
              TODAY'S PLAN
            </Text>

            <Text style={styles.scheduleSubtitle}>
              Your scheduled blocks
            </Text>
          </View>

          <Text style={styles.slotCount}>4 SLOTS</Text>
        </View>

        {/* SLOT LIST */}

        <View style={styles.slotList}>
          {initialSlots.map((slot, index) => (
            <Pressable
              key={slot.id}
              style={[
                styles.slot,
                slot.type === "late" && styles.lateSlot,
                slot.type === "ontime" && styles.ontimeSlot,
                index === 0 && styles.firstSlot,
                index === initialSlots.length - 1 &&
                  styles.lastSlot,
              ]}
            >
              <View
                style={[
                  styles.statusStripe,
                  slot.type === "late" &&
                    styles.lateStripe,
                  slot.type === "ontime" &&
                    styles.ontimeStripe,
                ]}
              />

              <View style={styles.slotMain}>
                <Text style={styles.slotName}>
                  {slot.name}
                </Text>

                <Text style={styles.slotLogged}>
                  {slot.logged === "—:--"
                    ? "Not logged"
                    : `Logged at ${slot.logged}`}
                </Text>
              </View>

              <View style={styles.targetBlock}>
                <Text style={styles.smallLabel}>
                  TARGET
                </Text>

                <Text style={styles.target}>
                  {slot.target}
                </Text>
              </View>

              <View style={styles.statusBlock}>
                <View style={styles.statusTop}>
                  <Text style={styles.statusIcon}>
                    {slot.type === "pending" ? "○" : "✓"}
                  </Text>

                  <Text style={styles.statusText}>
                    {slot.type === "pending"
                      ? "Pending"
                      : "Done"}
                  </Text>
                </View>

                <Text
                  style={[
                    styles.badge,
                    slot.type === "late" &&
                      styles.lateBadge,
                    slot.type === "ontime" &&
                      styles.ontimeBadge,
                  ]}
                >
                  {slot.badge}
                </Text>
              </View>
            </Pressable>
          ))}
        </View>

        {/* METRICS */}

        <View style={styles.metrics}>
          <View style={styles.metric}>
            <Text style={styles.metricLabel}>
              PROGRESS
            </Text>

            <Text style={styles.metricValue}>
              17.8%
            </Text>
          </View>

          <View style={styles.metricDivider} />

          <View style={styles.metric}>
            <Text style={styles.metricLabel}>
              COMPLIANCE
            </Text>

            <Text style={styles.metricValue}>
              50%
            </Text>
          </View>

          <View style={styles.metricDivider} />

          <View style={styles.metric}>
            <Text style={styles.metricLabel}>
              FAILURES
            </Text>

            <Text style={styles.metricValue}>
              1/3
            </Text>
          </View>
        </View>

        {/* ADD SLOT */}

        <Pressable style={styles.addSlot}>
          <Text style={styles.addIcon}>+</Text>

          <Text style={styles.addText}>
            Add Slot
          </Text>
        </Pressable>

        {/* FOOTER */}

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            PROJECT I
          </Text>

          <Text style={styles.footerText}>
            BUILD 0.1
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#000000",
  },

  scroll: {
    flex: 1,
    backgroundColor: "#000000",
  },

  container: {
    paddingHorizontal: 18,
    paddingTop: 20,
    paddingBottom: 80,
  },

  /* HEADER */

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 32,
  },

  eyebrow: {
    color: "#666666",
    fontSize: 9,
    fontWeight: "700",
    letterSpacing: 1.6,
    marginBottom: 7,
  },

  title: {
    color: "#FFFFFF",
    fontSize: 38,
    fontWeight: "400",
    letterSpacing: -1.5,
  },

  settingsButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#171717",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#292929",
  },

  settingsIcon: {
    color: "#FFFFFF",
    fontSize: 23,
  },

  /* DATE */

  dayCard: {
    minHeight: 118,
    backgroundColor: "#111111",
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "#222222",
    paddingHorizontal: 20,
    paddingVertical: 18,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 18,
  },

  dayEyebrow: {
    color: "#6B6B6B",
    fontSize: 8,
    fontWeight: "700",
    letterSpacing: 1.5,
    marginBottom: 8,
  },

  dayTitleRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  dayNumber: {
    color: "#FFFFFF",
    fontSize: 48,
    lineHeight: 52,
    fontWeight: "300",
    letterSpacing: -2,
    marginRight: 12,
  },

  dayMonth: {
    color: "#777777",
    fontSize: 9,
    fontWeight: "700",
    letterSpacing: 1.2,
    marginBottom: 4,
  },

  dayName: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "500",
  },

  dayArrows: {
    flexDirection: "row",
    gap: 8,
  },

  arrowButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#1B1B1B",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#292929",
  },

  arrow: {
    color: "#FFFFFF",
    fontSize: 29,
    fontWeight: "200",
    marginTop: -2,
  },

  /* FOCUS */

  focusCard: {
    backgroundColor: "#111111",
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "#222222",
    padding: 20,
    marginBottom: 32,
  },

  focusHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 18,
  },

  sectionLabel: {
    color: "#777777",
    fontSize: 9,
    fontWeight: "700",
    letterSpacing: 1.4,
  },

  activeBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  activeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#FFFFFF",
  },

  activeText: {
    color: "#888888",
    fontSize: 8,
    fontWeight: "700",
    letterSpacing: 1,
  },

  focusTitle: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "600",
    letterSpacing: -0.5,
  },

  focusSubtitle: {
    color: "#707070",
    fontSize: 12,
    marginTop: 5,
    marginBottom: 22,
  },

  progressTrack: {
    height: 5,
    backgroundColor: "#292929",
    borderRadius: 5,
    overflow: "hidden",
  },

  progressFill: {
    width: "72%",
    height: "100%",
    backgroundColor: "#FFFFFF",
  },

  progressInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },

  mutedText: {
    color: "#666666",
    fontSize: 8,
    fontWeight: "600",
    letterSpacing: 0.6,
  },

  strongText: {
    color: "#BDBDBD",
    fontSize: 8,
    fontWeight: "700",
    letterSpacing: 0.6,
  },

  /* SCHEDULE */

  scheduleHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginBottom: 13,
  },

  scheduleTitle: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "600",
  },

  scheduleSubtitle: {
    color: "#666666",
    fontSize: 10,
    marginTop: 4,
  },

  slotCount: {
    color: "#666666",
    fontSize: 8,
    fontWeight: "700",
    letterSpacing: 1,
  },

  /* SLOTS */

  slotList: {
    borderRadius: 20,
    overflow: "hidden",
    backgroundColor: "#111111",
    borderWidth: 1,
    borderColor: "#202020",
    marginBottom: 28,
  },

  slot: {
    minHeight: 91,
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingRight: 14,
    backgroundColor: "#111111",
    borderBottomWidth: 1,
    borderBottomColor: "#222222",
  },

  firstSlot: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },

  lastSlot: {
    borderBottomWidth: 0,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },

  lateSlot: {
    backgroundColor: "#351D23",
  },

  ontimeSlot: {
    backgroundColor: "#2947A5",
  },

  statusStripe: {
    width: 3,
    height: 52,
    backgroundColor: "#555555",
    marginRight: 13,
  },

  lateStripe: {
    backgroundColor: "#D98999",
  },

  ontimeStripe: {
    backgroundColor: "#FFFFFF",
  },

  slotMain: {
    flex: 1,
    paddingRight: 8,
  },

  slotName: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "600",
    lineHeight: 18,
  },

  slotLogged: {
    color: "#777777",
    fontSize: 9,
    marginTop: 5,
  },

  targetBlock: {
    width: 64,
  },

  smallLabel: {
    color: "#686868",
    fontSize: 7,
    fontWeight: "700",
    letterSpacing: 1,
    marginBottom: 4,
  },

  target: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "500",
  },

  statusBlock: {
    width: 78,
  },

  statusTop: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },

  statusIcon: {
    color: "#FFFFFF",
    fontSize: 17,
  },

  statusText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "500",
  },

  badge: {
    color: "#777777",
    fontSize: 8,
    marginTop: 5,
  },

  lateBadge: {
    color: "#E2AAB4",
  },

  ontimeBadge: {
    color: "#FFFFFF",
  },

  /* METRICS */

  metrics: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 30,
    paddingHorizontal: 3,
  },

  metric: {
    flex: 1,
  },

  metricLabel: {
    color: "#666666",
    fontSize: 7,
    fontWeight: "700",
    letterSpacing: 1.2,
    marginBottom: 7,
  },

  metricValue: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
  },

  metricDivider: {
    width: 1,
    height: 34,
    backgroundColor: "#333333",
    marginHorizontal: 7,
  },

  /* ADD SLOT */

  addSlot: {
    height: 58,
    borderRadius: 29,
    backgroundColor: "#1C1C1C",
    borderWidth: 1,
    borderColor: "#292929",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
  },

  addIcon: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "300",
  },

  addText: {
    color: "#EEEEEE",
    fontSize: 15,
    fontWeight: "500",
  },

  /* FOOTER */

  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 60,
    paddingHorizontal: 4,
  },

  footerText: {
    color: "#383838",
    fontSize: 8,
    fontWeight: "700",
    letterSpacing: 1.4,
  },
});