import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  Animated,
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
  useWindowDimensions,
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { MaterialCommunityIcons } from "@expo/vector-icons";

/* =========================================================
   THEME
========================================================= */

const YELLOW = "#F4C400";
const BLACK = "#070707";
const PANEL = "#101010";
const PANEL_2 = "#151515";
const BORDER = "#272727";
const WHITE = "#F7F7F5";
const MUTED = "#999999";
const DIM = "#686868";
const GREEN = "#A8D08D";

const STORAGE_KEY = "@nyayasaathi_cases";

/* =========================================================
   DATA
========================================================= */

const RIGHTS = [
  {
    id: "safety",
    number: "01",
    icon: "shield-check-outline",
    title: "Right to Safety",
    short: "Protection from hazardous goods and services.",
    description:
      "Consumers have the right to be protected against goods and services that may be hazardous to life or property.",
    examples: [
      "Unsafe or hazardous products",
      "Defective electrical or mechanical goods",
      "Unsafe food or packaged products",
      "Services creating avoidable safety risks",
    ],
  },

  {
    id: "information",
    number: "02",
    icon: "information-outline",
    title: "Right to Information",
    short: "Know what you are buying and what it costs.",
    description:
      "Consumers should have access to relevant information needed to make informed choices.",
    examples: [
      "Price and applicable charges",
      "Quantity, quality and specifications",
      "Product or service terms",
      "Warranty or guarantee information",
      "Important limitations and conditions",
    ],
  },

  {
    id: "choice",
    number: "03",
    icon: "swap-horizontal",
    title: "Right to Choose",
    short: "Access meaningful choice at competitive prices.",
    description:
      "Consumers should be able to make choices among products and services based on available information and market options.",
    examples: [
      "Forced purchases",
      "Bundled products or services",
      "Unfair restrictions on choice",
      "Pressure-selling practices",
    ],
  },

  {
    id: "heard",
    number: "04",
    icon: "account-voice",
    title: "Right to Be Heard",
    short: "Have your interests and complaints considered.",
    description:
      "Consumer interests should receive due consideration, including when complaints and grievances are raised.",
    examples: [
      "Complaint not being acknowledged",
      "Customer support refusing to record a grievance",
      "Consumer feedback being ignored",
      "Difficulty accessing a grievance mechanism",
    ],
  },

  {
    id: "redressal",
    number: "05",
    icon: "gavel",
    title: "Right to Seek Redressal",
    short: "Seek appropriate remedy for genuine grievances.",
    description:
      "Consumers have the right to seek redressal against unfair or restrictive trade practices and exploitation.",
    examples: [
      "Deficiency in goods or services",
      "Unfair trade practices",
      "Unresolved consumer grievances",
      "Financial loss caused by a consumer transaction",
    ],
  },

  {
    id: "education",
    number: "06",
    icon: "school-outline",
    title: "Right to Consumer Education",
    short: "Know your rights and how to exercise them.",
    description:
      "Consumers have the right to acquire the knowledge and skills necessary to make informed consumer decisions.",
    examples: [
      "Understanding consumer rights",
      "Learning how to preserve evidence",
      "Understanding complaint pathways",
      "Knowing where to seek further assistance",
    ],
  },
];

const ISSUES = [
  {
    id: "product-safety",
    icon: "shield-alert-outline",
    category: "Products & Safety",
    title: "Unsafe or Hazardous Product",
    description: "Concerns involving products that may pose safety risks.",
    rights: ["safety", "information", "redressal"],
  },

  {
    id: "misleading",
    icon: "bullhorn-outline",
    category: "Advertising",
    title: "Misleading Advertisement",
    description:
      "Claims, representations or promotions that may mislead consumers.",
    rights: ["information", "redressal"],
  },

  {
    id: "hidden-charges",
    icon: "cash-minus",
    category: "Pricing",
    title: "Hidden Charges",
    description:
      "Unexpected fees, charges or pricing information appearing late in a transaction.",
    rights: ["information", "choice"],
  },

  {
    id: "dark-patterns",
    icon: "cursor-default-click-outline",
    category: "Digital Consumer",
    title: "Dark Patterns",
    description:
      "Interface or design practices that may manipulate consumer decisions.",
    rights: ["information", "choice"],
  },

  {
    id: "counterfeit",
    icon: "alert-octagon-outline",
    category: "Products",
    title: "Counterfeit / Fake Product",
    description:
      "Concerns about authenticity, imitation or misrepresentation.",
    rights: ["information", "safety", "redressal"],
  },

  {
    id: "quantity",
    icon: "scale-balance",
    category: "Pricing & Measurement",
    title: "Quantity / Measurement Issue",
    description:
      "Concerns involving quantity, weight, measurement or packaged declarations.",
    rights: ["information", "redressal"],
  },

  {
    id: "mrp",
    icon: "tag-outline",
    category: "Pricing",
    title: "MRP / Overcharging",
    description:
      "A concern about the displayed price, charging practice or price information.",
    rights: ["information", "redressal"],
  },

  {
    id: "warranty",
    icon: "certificate-outline",
    category: "Products",
    title: "Warranty / Guarantee",
    description:
      "Disputes involving warranty, guarantee or after-sales commitments.",
    rights: ["information", "redressal"],
  },

  {
    id: "service",
    icon: "room-service-outline",
    category: "Services",
    title: "Deficiency in Service",
    description:
      "A service was not delivered as represented or expected.",
    rights: ["information", "heard", "redressal"],
  },

  {
    id: "banking",
    icon: "bank-outline",
    category: "Financial Services",
    title: "Banking / Financial Service",
    description:
      "Consumer grievances involving banking or financial services.",
    rights: ["information", "heard", "redressal"],
  },

  {
    id: "telecom",
    icon: "cellphone-wireless",
    category: "Telecom & Internet",
    title: "Telecom / Internet",
    description:
      "Issues involving telecom, connectivity, billing or service delivery.",
    rights: ["information", "heard", "redressal"],
  },

  {
    id: "travel",
    icon: "airplane-outline",
    category: "Travel",
    title: "Travel / Hospitality",
    description:
      "Consumer issues involving travel, hotels or hospitality services.",
    rights: ["information", "choice", "redressal"],
  },

  {
    id: "healthcare",
    icon: "hospital-box-outline",
    category: "Healthcare",
    title: "Healthcare Service",
    description:
      "Consumer-facing grievances involving healthcare services or transactions.",
    rights: ["information", "heard", "redressal"],
  },

  {
    id: "housing",
    icon: "home-city-outline",
    category: "Housing",
    title: "Housing / Real Estate",
    description:
      "Consumer concerns relating to housing products or services.",
    rights: ["information", "heard", "redressal"],
  },

  {
    id: "food",
    icon: "food-outline",
    category: "Food",
    title: "Food / Restaurant",
    description:
      "Concerns about food quality, information, pricing or service.",
    rights: ["safety", "information", "redressal"],
  },

  {
    id: "automotive",
    icon: "car-wrench",
    category: "Automotive",
    title: "Vehicle / Service Centre",
    description:
      "Issues involving vehicles, repairs, servicing or related consumer transactions.",
    rights: ["information", "redressal"],
  },

  {
    id: "education",
    icon: "school-outline",
    category: "Education",
    title: "Education Service",
    description:
      "Consumer-facing concerns involving educational services and transactions.",
    rights: ["information", "heard", "redressal"],
  },

  {
    id: "contracts",
    icon: "file-document-edit-outline",
    category: "Contracts",
    title: "Contract / Terms",
    description:
      "Concerns about contractual terms, representations or consumer-facing conditions.",
    rights: ["information", "choice", "redressal"],
  },

  {
    id: "ecommerce",
    icon: "cart-outline",
    category: "Digital Commerce",
    title: "E-Commerce",
    description:
      "Online shopping, marketplace, payment, delivery and transaction concerns.",
    rights: ["information", "choice", "redressal"],
  },
];

/* =========================================================
   ICON
========================================================= */

function Icon({
  name,
  size = 22,
  color = WHITE,
}) {
  return (
    <MaterialCommunityIcons
      name={name}
      size={size}
      color={color}
    />
  );
}

/* =========================================================
   LOGO
========================================================= */

function Logo({ compact = false }) {
  return (
    <View style={styles.logoRow}>
      <View style={styles.logoMark}>
        <Icon
          name="scale-balance"
          size={compact ? 18 : 21}
          color={BLACK}
        />
      </View>

      <View>
        <Text style={styles.logoText}>
          NYAYASAATHI
        </Text>

        {!compact && (
          <Text style={styles.logoSub}>
            CONSUMER LEGAL AWARENESS
          </Text>
        )}
      </View>
    </View>
  );
}

/* =========================================================
   RESPONSIVE GRID
========================================================= */

function ResponsiveGrid({
  children,
  columns = 3,
  gap = 12,
}) {
  const { width } = useWindowDimensions();

  let actualColumns = columns;

  if (width < 600) {
    actualColumns = 1;
  } else if (width < 900) {
    actualColumns = Math.min(2, columns);
  }

  const items = React.Children.toArray(children);

  return (
    <View
      style={{
        flexDirection: "row",
        flexWrap: "wrap",
        marginHorizontal: -(gap / 2),
      }}
    >
      {items.map((child, index) => (
        <View
          key={index}
          style={{
            width: `${100 / actualColumns}%`,
            paddingHorizontal: gap / 2,
            marginBottom: gap,
          }}
        >
          {child}
        </View>
      ))}
    </View>
  );
}

/* =========================================================
   SECTION HEADER
========================================================= */

function SectionHeader({
  eyebrow,
  title,
  description,
  right,
}) {
  return (
    <View style={styles.sectionHeader}>
      <View style={styles.sectionHeaderText}>
        {eyebrow && (
          <Text style={styles.eyebrow}>
            {eyebrow}
          </Text>
        )}

        <Text style={styles.sectionTitle}>
          {title}
        </Text>

        {description && (
          <Text style={styles.sectionDescription}>
            {description}
          </Text>
        )}
      </View>

      {right}
    </View>
  );
}

/* =========================================================
   BUTTON
========================================================= */

function Button({
  title,
  onPress,
  icon,
  secondary = false,
  small = false,
  full = false,
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        secondary
          ? styles.buttonSecondary
          : styles.buttonPrimary,
        small && styles.buttonSmall,
        full && styles.buttonFull,
        pressed && styles.pressed,
      ]}
    >
      {icon && (
        <Icon
          name={icon}
          size={small ? 16 : 18}
          color={secondary ? WHITE : BLACK}
        />
      )}

      <Text
        style={[
          styles.buttonText,
          secondary && styles.buttonTextSecondary,
          small && styles.buttonTextSmall,
        ]}
      >
        {title}
      </Text>
    </Pressable>
  );
}

/* =========================================================
   CARD
========================================================= */

function Card({ children, style }) {
  return (
    <View style={[styles.card, style]}>
      {children}
    </View>
  );
}

/* =========================================================
   TAG
========================================================= */

function Tag({ children }) {
  return (
    <View style={styles.tag}>
      <Text style={styles.tagText}>
        {children}
      </Text>
    </View>
  );
}

/* =========================================================
   BOTTOM NAV
========================================================= */

function BottomNav({
  screen,
  nav,
}) {
  const items = [
    ["home", "Home", "home-outline"],
    ["rights", "Rights", "scale-balance"],
    ["cases", "Cases", "briefcase-outline"],
    ["ask", "Ask AI", "message-text-outline"],
    ["profile", "Profile", "account-outline"],
  ];

  return (
    <View style={styles.bottomNavOuter}>
      <View style={styles.bottomNav}>
        {items.map(([id, label, icon]) => {
          const active =
            screen === id;

          return (
            <Pressable
              key={id}
              onPress={() => nav(id)}
              style={({ pressed }) => [
                styles.navItem,
                active && styles.navItemActive,
                pressed && styles.pressed,
              ]}
            >
              <Icon
                name={icon}
                size={20}
                color={
                  active
                    ? YELLOW
                    : MUTED
                }
              />

              <Text
                style={[
                  styles.navLabel,
                  active &&
                    styles.navLabelActive,
                ]}
              >
                {label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

/* =========================================================
   HOME
========================================================= */

function Home({
  nav,
  setSelectedIssue,
  startIntake,
}) {
  const { width } =
    useWindowDimensions();

  const isMobile = width < 600;

  const [query, setQuery] =
    useState("");

  const popularIssues =
    ISSUES.slice(0, 9);

  return (
    <ScrollView
      contentContainerStyle={
        styles.scrollContent
      }
      showsVerticalScrollIndicator={
        false
      }
    >
      <View style={styles.hero}>
        <View style={styles.heroTop}>
          <Logo />

          {!isMobile && (
            <View
              style={
                styles.secureBadge
              }
            >
              <Icon
                name="shield-check-outline"
                size={14}
                color={GREEN}
              />

              <Text
                style={
                  styles.secureText
                }
              >
                LOCAL • PRIVATE
              </Text>
            </View>
          )}
        </View>

        <View
          style={styles.heroContent}
        >
          <Text
            style={styles.heroEyebrow}
          >
            CONSUMER LEGAL AWARENESS
          </Text>

          <Text
            style={[
              styles.heroTitle,
              isMobile &&
                styles.heroTitleMobile,
            ]}
          >
            Know your rights.
            {"\n"}
            Know your next step.
          </Text>

          <Text
            style={
              styles.heroDescription
            }
          >
            Understand consumer rights,
            organise evidence and turn a
            grievance into a clear action
            plan.
          </Text>

          <View
            style={[
              styles.heroActions,
              isMobile &&
                styles.heroActionsMobile,
            ]}
          >
            <Button
              title="Describe what happened"
              icon="arrow-right"
              onPress={
                startIntake
              }
              full={isMobile}
            />

            <Button
              title="Explore consumer rights"
              icon="scale-balance"
              secondary
              onPress={() =>
                nav("rights")
              }
              full={isMobile}
            />
          </View>
        </View>

        {!isMobile && (
          <View
            style={
              styles.heroFooter
            }
          >
            <Text
              style={
                styles.heroFooterText
              }
            >
              AI explains • You decide •
              Evidence supports
            </Text>
          </View>
        )}
      </View>

      <View style={styles.content}>
        <SectionHeader
          eyebrow="THE SIX CORE RIGHTS"
          title="What every consumer should know"
          description="Start with the rights recognised as the foundation of consumer awareness."
          right={
            !isMobile && (
              <Pressable
                onPress={() =>
                  nav("rights")
                }
              >
                <Text
                  style={styles.linkText}
                >
                  View all →
                </Text>
              </Pressable>
            )
          }
        />

        <ResponsiveGrid columns={3}>
          {RIGHTS.map((right) => (
            <Pressable
              key={right.id}
              onPress={() =>
                nav("rights")
              }
              style={({ pressed }) => [
                styles.rightCard,
                pressed &&
                  styles.pressed,
              ]}
            >
              <View
                style={
                  styles.numberRow
                }
              >
                <Text
                  style={
                    styles.rightNumber
                  }
                >
                  {right.number}
                </Text>

                <Icon
                  name={right.icon}
                  size={24}
                  color={YELLOW}
                />
              </View>

              <Text
                style={
                  styles.rightTitle
                }
              >
                {right.title}
              </Text>

              <Text
                style={
                  styles.rightShort
                }
              >
                {right.short}
              </Text>
            </Pressable>
          ))}
        </ResponsiveGrid>

        <View
          style={styles.divider}
        />

        <SectionHeader
          eyebrow="CONSUMER ISSUES"
          title="What are you dealing with?"
          description="NyayaSaathi covers consumer concerns across products, services, finance, travel, healthcare and digital markets."
        />

        <View
          style={styles.searchBox}
        >
          <Icon
            name="magnify"
            size={21}
            color={DIM}
          />

          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Search an issue..."
            placeholderTextColor={
              DIM
            }
            style={
              styles.searchInput
            }
          />
        </View>

        <ResponsiveGrid columns={3}>
          {popularIssues
            .filter((item) =>
              item.title
                .toLowerCase()
                .includes(
                  query.toLowerCase()
                )
            )
            .map((item) => (
              <Pressable
                key={item.id}
                onPress={() => {
                  setSelectedIssue(
                    item
                  );
                  startIntake(item);
                }}
                style={({
                  pressed,
                }) => [
                  styles.issueCard,
                  pressed &&
                    styles.pressed,
                ]}
              >
                <Icon
                  name={item.icon}
                  size={23}
                  color={WHITE}
                />

                <View
                  style={
                    styles.issueCardText
                  }
                >
                  <Text
                    style={
                      styles.issueCategory
                    }
                  >
                    {item.category}
                  </Text>

                  <Text
                    style={
                      styles.issueTitle
                    }
                  >
                    {item.title}
                  </Text>
                </View>

                <Icon
                  name="arrow-top-right"
                  size={18}
                  color={DIM}
                />
              </Pressable>
            ))}
        </ResponsiveGrid>

        <Pressable
          onPress={() =>
            nav("rights")
          }
          style={({ pressed }) => [
            styles.fullLibrary,
            pressed &&
              styles.pressed,
          ]}
        >
          <View
            style={
              styles.fullLibraryText
            }
          >
            <Text
              style={
                styles.fullLibraryEyebrow
              }
            >
              CONSUMER KNOWLEDGE BASE
            </Text>

            <Text
              style={
                styles.fullLibraryTitle
              }
            >
              Explore the complete issue
              library
            </Text>
          </View>

          <Icon
            name="arrow-right"
            size={24}
            color={BLACK}
          />
        </Pressable>

        <View style={styles.journey}>
          <SectionHeader
            eyebrow="THE NYAYASAATHI METHOD"
            title="From confusion to action"
          />

          <ResponsiveGrid columns={4}>
            {[
              [
                "01",
                "Understand",
                "Explain the situation in plain language.",
              ],
              [
                "02",
                "Identify",
                "Map the concern to relevant consumer rights.",
              ],
              [
                "03",
                "Prepare",
                "Build an evidence checklist and action plan.",
              ],
              [
                "04",
                "Act",
                "Prepare a structured complaint or escalation.",
              ],
            ].map(
              ([
                number,
                title,
                description,
              ]) => (
                <View
                  key={number}
                  style={
                    styles.journeyItem
                  }
                >
                  <Text
                    style={
                      styles.journeyNumber
                    }
                  >
                    {number}
                  </Text>

                  <Text
                    style={
                      styles.journeyTitle
                    }
                  >
                    {title}
                  </Text>

                  <Text
                    style={
                      styles.journeyDescription
                    }
                  >
                    {description}
                  </Text>
                </View>
              )
            )}
          </ResponsiveGrid>
        </View>

        <View
          style={styles.disclaimer}
        >
          <Icon
            name="information-outline"
            size={18}
            color={YELLOW}
          />

          <Text
            style={
              styles.disclaimerText
            }
          >
            NyayaSaathi provides general
            legal awareness and does not
            replace professional legal
            advice.
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

/* =========================================================
   RIGHTS SCREEN
========================================================= */

function RightsScreen({
  nav,
  setSelectedRight,
}) {
  const [selected, setSelected] =
    useState(null);

  const selectedRight =
    RIGHTS.find(
      (r) => r.id === selected
    );

  return (
    <ScrollView
      contentContainerStyle={
        styles.scrollContent
      }
      showsVerticalScrollIndicator={
        false
      }
    >
      <View
        style={styles.pageHeader}
      >
        <Logo compact />

        <Text
          style={styles.pageKicker}
        >
          LEGAL KNOWLEDGE
        </Text>

        <Text
          style={styles.pageTitle}
        >
          Consumer Rights
        </Text>

        <Text
          style={
            styles.pageDescription
          }
        >
          A practical guide to the six
          foundational consumer rights
          and the situations in which
          they matter.
        </Text>
      </View>

      <View style={styles.content}>
        {selectedRight ? (
          <>
            <Pressable
              onPress={() =>
                setSelected(null)
              }
              style={styles.back}
            >
              <Icon
                name="arrow-left"
                size={18}
                color={YELLOW}
              />

              <Text
                style={styles.backText}
              >
                All rights
              </Text>
            </Pressable>

            <Card
              style={
                styles.rightDetail
              }
            >
              <View
                style={
                  styles.detailIcon
                }
              >
                <Icon
                  name={
                    selectedRight.icon
                  }
                  size={30}
                  color={YELLOW}
                />
              </View>

              <Text
                style={
                  styles.detailNumber
                }
              >
                RIGHT{" "}
                {selectedRight.number}
              </Text>

              <Text
                style={
                  styles.detailTitle
                }
              >
                {selectedRight.title}
              </Text>

              <Text
                style={
                  styles.detailDescription
                }
              >
                {
                  selectedRight.description
                }
              </Text>

              <Text
                style={styles.subheading}
              >
                WHERE IT MAY MATTER
              </Text>

              {selectedRight.examples.map(
                (example) => (
                  <View
                    key={example}
                    style={
                      styles.bulletRow
                    }
                  >
                    <View
                      style={
                        styles.bullet
                      }
                    />

                    <Text
                      style={
                        styles.bulletText
                      }
                    >
                      {example}
                    </Text>
                  </View>
                )
              )}

              <Button
                title="Start with this right"
                icon="arrow-right"
                onPress={() => {
                  setSelectedRight(
                    selectedRight
                  );
                  nav("ask");
                }}
              />
            </Card>
          </>
        ) : (
          <>
            <ResponsiveGrid columns={3}>
              {RIGHTS.map((right) => (
                <Pressable
                  key={right.id}
                  onPress={() =>
                    setSelected(
                      right.id
                    )
                  }
                  style={({
                    pressed,
                  }) => [
                    styles.largeRightCard,
                    pressed &&
                      styles.pressed,
                  ]}
                >
                  <View
                    style={
                      styles.largeRightTop
                    }
                  >
                    <Text
                      style={
                        styles.largeRightNumber
                      }
                    >
                      {right.number}
                    </Text>

                    <Icon
                      name={right.icon}
                      size={30}
                      color={YELLOW}
                    />
                  </View>

                  <Text
                    style={
                      styles.largeRightTitle
                    }
                  >
                    {right.title}
                  </Text>

                  <Text
                    style={
                      styles.largeRightDescription
                    }
                  >
                    {right.short}
                  </Text>

                  <View
                    style={
                      styles.learnMore
                    }
                  >
                    <Text
                      style={
                        styles.learnMoreText
                      }
                    >
                      Learn more
                    </Text>

                    <Icon
                      name="arrow-right"
                      size={17}
                      color={YELLOW}
                    />
                  </View>
                </Pressable>
              ))}
            </ResponsiveGrid>

            <View
              style={styles.divider}
            />

            <SectionHeader
              eyebrow="ISSUE LIBRARY"
              title="Consumer concerns"
              description="Browse common areas where consumer rights and grievance mechanisms may become relevant."
            />

            <ResponsiveGrid columns={3}>
              {ISSUES.map((issue) => (
                <Pressable
                  key={issue.id}
                  onPress={() =>
                    nav("ask")
                  }
                  style={({
                    pressed,
                  }) => [
                    styles.libraryItem,
                    pressed &&
                      styles.pressed,
                  ]}
                >
                  <Icon
                    name={issue.icon}
                    size={21}
                    color={YELLOW}
                  />

                  <View
                    style={
                      styles.libraryItemText
                    }
                  >
                    <Text
                      style={
                        styles.libraryTitle
                      }
                    >
                      {issue.title}
                    </Text>

                    <Text
                      style={
                        styles.libraryCategory
                      }
                    >
                      {issue.category}
                    </Text>
                  </View>

                  <Icon
                    name="chevron-right"
                    size={18}
                    color={DIM}
                  />
                </Pressable>
              ))}
            </ResponsiveGrid>
          </>
        )}
      </View>
    </ScrollView>
  );
}

/* =========================================================
   ASK SCREEN
========================================================= */

function AskScreen({
  selectedIssue,
  setSelectedIssue,
  analyze,
  nav,
}) {
  const { width } =
    useWindowDimensions();

  const isMobile = width < 600;

  const [text, setText] =
    useState("");

  const [category, setCategory] =
    useState(
      selectedIssue?.title || ""
    );

  useEffect(() => {
    if (selectedIssue) {
      setCategory(
        selectedIssue.title
      );
    }
  }, [selectedIssue]);

  return (
    <ScrollView
      contentContainerStyle={
        styles.scrollContent
      }
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={
        false
      }
    >
      <View
        style={styles.pageHeader}
      >
        <Logo compact />

        <Text
          style={styles.pageKicker}
        >
          NYAYASAATHI AI
        </Text>

        <Text
          style={[
            styles.pageTitle,
            isMobile &&
              styles.pageTitleMobile,
          ]}
        >
          Describe your situation
        </Text>

        <Text
          style={
            styles.pageDescription
          }
        >
          Tell us what happened.
          NyayaSaathi will organise the
          information into a
          consumer-awareness action plan.
        </Text>
      </View>

      <View style={styles.content}>
        <Card
          style={styles.aiCard}
        >
          <View
            style={styles.aiHeader}
          >
            <View
              style={styles.aiIcon}
            >
              <Icon
                name="scale-balance"
                size={23}
                color={BLACK}
              />
            </View>

            <View>
              <Text
                style={styles.aiTitle}
              >
                NyayaSaathi AI
              </Text>

              <Text
                style={styles.aiStatus}
              >
                GENERAL LEGAL AWARENESS
              </Text>
            </View>
          </View>

          <Text style={styles.label}>
            WHAT HAPPENED?
          </Text>

          <TextInput
            value={text}
            onChangeText={setText}
            placeholder="Example: A service provider charged me an amount that was not clearly disclosed..."
            placeholderTextColor={DIM}
            multiline
            textAlignVertical="top"
            style={styles.largeInput}
          />

          <Text style={styles.label}>
            OPTIONAL ISSUE TYPE
          </Text>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={
              false
            }
            contentContainerStyle={
              styles.chipScroll
            }
          >
            {ISSUES.slice(
              0,
              10
            ).map((issue) => {
              const active =
                category ===
                issue.title;

              return (
                <Pressable
                  key={issue.id}
                  onPress={() => {
                    setCategory(
                      issue.title
                    );
                    setSelectedIssue(
                      issue
                    );
                  }}
                  style={[
                    styles.selectChip,
                    active &&
                      styles.selectChipActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.selectChipText,
                      active &&
                        styles.selectChipTextActive,
                    ]}
                  >
                    {issue.title}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>

          <View
            style={styles.aiFooter}
          >
            <Icon
              name="lock-outline"
              size={16}
              color={DIM}
            />

            <Text
              style={
                styles.aiFooterText
              }
            >
              Your MVP data is stored
              locally on this device.
            </Text>
          </View>

          <Button
            title="Analyse my situation"
            icon="arrow-right"
            full
            onPress={() => {
              const finalText =
                text.trim() ||
                "I want to understand my consumer rights and what I can do about this situation.";

              analyze({
                text: finalText,
                category,
                issue: selectedIssue,
              });
            }}
          />
        </Card>

        <View
          style={styles.noteBlock}
        >
          <Text
            style={styles.noteTitle}
          >
            WHAT HAPPENS NEXT
          </Text>

          {[
            [
              "01",
              "We identify the consumer-rights areas that may be relevant.",
            ],
            [
              "02",
              "We turn the situation into a clear action plan.",
            ],
            [
              "03",
              "We suggest evidence to preserve before escalation.",
            ],
          ].map(
            ([number, text]) => (
              <View
                key={number}
                style={styles.noteRow}
              >
                <Text
                  style={
                    styles.noteNumber
                  }
                >
                  {number}
                </Text>

                <Text
                  style={styles.noteText}
                >
                  {text}
                </Text>
              </View>
            )
          )}
        </View>

        <Pressable
          onPress={() =>
            nav("rights")
          }
          style={styles.textLink}
        >
          <Text
            style={styles.linkText}
          >
            I want to learn about my
            rights first →
          </Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

/* =========================================================
   ANALYSIS
========================================================= */

function AnalysisScreen({
  analysis,
  toggleEvidence,
  saveCase,
  generateComplaint,
}) {
  if (!analysis) {
    return (
      <View
        style={styles.emptyScreen}
      >
        <Text
          style={styles.emptyTitle}
        >
          No analysis yet
        </Text>
      </View>
    );
  }

  return (
    <ScrollView
      contentContainerStyle={
        styles.scrollContent
      }
      showsVerticalScrollIndicator={
        false
      }
    >
      <View
        style={styles.pageHeader}
      >
        <Logo compact />

        <Text
          style={styles.pageKicker}
        >
          CASE ANALYSIS
        </Text>

        <Text
          style={styles.pageTitle}
        >
          Your situation, organised.
        </Text>

        <Text
          style={
            styles.pageDescription
          }
        >
          This is a structured awareness
          summary, not a legal
          determination.
        </Text>
      </View>

      <View style={styles.content}>
        <Card>
          <Text style={styles.label}>
            WHAT WE UNDERSTAND
          </Text>

          <Text
            style={styles.analysisText}
          >
            {analysis.text}
          </Text>
        </Card>

        <View
          style={styles.analysisSection}
        >
          <SectionHeader
            eyebrow="RIGHTS"
            title="Potentially relevant rights"
          />

          <View
            style={styles.tagsWrap}
          >
            {analysis.rights.map(
              (right) => (
                <Tag key={right}>
                  {right}
                </Tag>
              )
            )}
          </View>
        </View>

        <View
          style={styles.analysisSection}
        >
          <SectionHeader
            eyebrow="PLAIN LANGUAGE"
            title="What this means"
          />

          <Card>
            <Text
              style={styles.explanation}
            >
              {analysis.explanation}
            </Text>
          </Card>
        </View>

        <View
          style={styles.analysisSection}
        >
          <SectionHeader
            eyebrow="ACTION PLAN"
            title="What you can do next"
          />

          {analysis.actions.map(
            (action, index) => (
              <View
                key={action}
                style={styles.actionRow}
              >
                <View
                  style={
                    styles.actionNumber
                  }
                >
                  <Text
                    style={
                      styles.actionNumberText
                    }
                  >
                    {String(
                      index + 1
                    ).padStart(
                      2,
                      "0"
                    )}
                  </Text>
                </View>

                <Text
                  style={
                    styles.actionText
                  }
                >
                  {action}
                </Text>
              </View>
            )
          )}
        </View>

        <View
          style={styles.analysisSection}
        >
          <SectionHeader
            eyebrow="EVIDENCE"
            title="Build your evidence file"
            description="Tap each item once you have preserved it."
          />

          <Card>
            {analysis.evidence.map(
              (item) => (
                <Pressable
                  key={item.id}
                  onPress={() =>
                    toggleEvidence(
                      item.id
                    )
                  }
                  style={
                    styles.evidenceRow
                  }
                >
                  <View
                    style={[
                      styles.checkbox,
                      item.done &&
                        styles.checkboxDone,
                    ]}
                  >
                    {item.done && (
                      <Icon
                        name="check"
                        size={15}
                        color={BLACK}
                      />
                    )}
                  </View>

                  <View
                    style={
                      styles.evidenceText
                    }
                  >
                    <Text
                      style={
                        styles.evidenceTitle
                      }
                    >
                      {item.title}
                    </Text>

                    <Text
                      style={
                        styles.evidenceDescription
                      }
                    >
                      {
                        item.description
                      }
                    </Text>
                  </View>
                </Pressable>
              )
            )}
          </Card>
        </View>

        <View
          style={styles.twoButtons}
        >
          <Button
            title="Save as case"
            icon="briefcase-plus-outline"
            onPress={saveCase}
          />

          <Button
            title="Draft complaint"
            icon="file-document-edit-outline"
            secondary
            onPress={
              generateComplaint
            }
          />
        </View>

        <View
          style={styles.disclaimer}
        >
          <Icon
            name="alert-outline"
            size={18}
            color={YELLOW}
          />

          <Text
            style={
              styles.disclaimerText
            }
          >
            This analysis is for general
            consumer awareness. Whether a
            specific legal remedy applies
            depends on the facts and
            applicable law.
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

/* =========================================================
   COMPLAINT
========================================================= */

function ComplaintScreen({
  complaint,
  nav,
}) {
  return (
    <ScrollView
      contentContainerStyle={
        styles.scrollContent
      }
      showsVerticalScrollIndicator={
        false
      }
    >
      <View
        style={styles.pageHeader}
      >
        <Logo compact />

        <Text
          style={styles.pageKicker}
        >
          DOCUMENT PREPARATION
        </Text>

        <Text
          style={styles.pageTitle}
        >
          Complaint Draft
        </Text>

        <Text
          style={
            styles.pageDescription
          }
        >
          A structured starting point
          that you can review and edit
          before sending.
        </Text>
      </View>

      <View style={styles.content}>
        <Card
          style={
            styles.documentCard
          }
        >
          <View
            style={
              styles.documentHeader
            }
          >
            <Text
              style={
                styles.documentLabel
              }
            >
              DRAFT
            </Text>

            <Icon
              name="file-document-outline"
              size={22}
              color={YELLOW}
            />
          </View>

          <Text
            style={styles.documentText}
          >
            {complaint}
          </Text>
        </Card>

        <View
          style={styles.twoButtons}
        >
          <Button
            title="Back to cases"
            icon="arrow-left"
            secondary
            onPress={() =>
              nav("cases")
            }
          />

          <Button
            title="Save draft"
            icon="content-save-outline"
            onPress={() =>
              nav("cases")
            }
          />
        </View>
      </View>
    </ScrollView>
  );
}

/* =========================================================
   CASES
========================================================= */

function CasesScreen({
  cases,
  nav,
  setActiveCase,
}) {
  return (
    <ScrollView
      contentContainerStyle={
        styles.scrollContent
      }
      showsVerticalScrollIndicator={
        false
      }
    >
      <View
        style={styles.pageHeader}
      >
        <Logo compact />

        <Text
          style={styles.pageKicker}
        >
          CASE MANAGEMENT
        </Text>

        <Text
          style={styles.pageTitle}
        >
          My Cases
        </Text>

        <Text
          style={
            styles.pageDescription
          }
        >
          Keep your consumer grievances,
          evidence and action plans
          organised in one place.
        </Text>
      </View>

      <View style={styles.content}>
        <View
          style={styles.caseToolbar}
        >
          <View>
            <Text
              style={styles.caseCount}
            >
              {cases.length}
            </Text>

            <Text
              style={
                styles.caseCountLabel
              }
            >
              LOCAL CASES
            </Text>
          </View>

          <Button
            title="New case"
            icon="plus"
            small
            onPress={() =>
              nav("ask")
            }
          />
        </View>

        {cases.length === 0 ? (
          <Card
            style={
              styles.emptyState
            }
          >
            <Icon
              name="briefcase-outline"
              size={38}
              color={DIM}
            />

            <Text
              style={
                styles.emptyTitle
              }
            >
              No cases yet
            </Text>

            <Text
              style={styles.emptyText}
            >
              Start by describing a
              consumer situation and
              NyayaSaathi will help you
              structure it.
            </Text>

            <Button
              title="Start a case"
              icon="arrow-right"
              onPress={() =>
                nav("ask")
              }
            />
          </Card>
        ) : (
          cases.map((item) => (
            <Pressable
              key={item.id}
              onPress={() => {
                setActiveCase(
                  item
                );
                nav("analysis");
              }}
              style={({
                pressed,
              }) => [
                styles.caseCard,
                pressed &&
                  styles.pressed,
              ]}
            >
              <View
                style={
                  styles.caseIcon
                }
              >
                <Icon
                  name="briefcase-outline"
                  size={22}
                  color={YELLOW}
                />
              </View>

              <View
                style={
                  styles.caseMain
                }
              >
                <Text
                  style={
                    styles.caseTitle
                  }
                >
                  {item.title}
                </Text>

                <Text
                  style={
                    styles.caseIssue
                  }
                >
                  {item.issue}
                </Text>

                <Text
                  style={
                    styles.caseDate
                  }
                >
                  {item.date}
                </Text>
              </View>

              <Tag>
                {item.status}
              </Tag>
            </Pressable>
          ))
        )}
      </View>
    </ScrollView>
  );
}

/* =========================================================
   PROFILE
========================================================= */

function ProfileScreen() {
  return (
    <ScrollView
      contentContainerStyle={
        styles.scrollContent
      }
      showsVerticalScrollIndicator={
        false
      }
    >
      <View
        style={styles.pageHeader}
      >
        <Logo compact />

        <Text
          style={styles.pageKicker}
        >
          SETTINGS & INFORMATION
        </Text>

        <Text
          style={styles.pageTitle}
        >
          Profile
        </Text>

        <Text
          style={
            styles.pageDescription
          }
        >
          Your NyayaSaathi workspace and
          privacy information.
        </Text>
      </View>

      <View style={styles.content}>
        <Card
          style={
            styles.profileCard
          }
        >
          <View
            style={
              styles.profileIcon
            }
          >
            <Icon
              name="account-outline"
              size={30}
              color={YELLOW}
            />
          </View>

          <View
            style={
              styles.profileText
            }
          >
            <Text
              style={
                styles.profileTitle
              }
            >
              Local Workspace
            </Text>

            <Text
              style={
                styles.profileDescription
              }
            >
              No account required for this
              MVP.
            </Text>
          </View>
        </Card>

        {[
          [
            "shield-lock-outline",
            "Privacy",
            "Case information is stored locally in this MVP.",
          ],
          [
            "database-outline",
            "Knowledge Base",
            "Consumer-awareness content is structured into the application.",
          ],
          [
            "scale-balance",
            "Legal Disclaimer",
            "NyayaSaathi is an awareness and information tool, not a substitute for a lawyer.",
          ],
          [
            "information-outline",
            "About NyayaSaathi",
            "AI explains. Humans decide.",
          ],
        ].map(
          ([
            icon,
            title,
            description,
          ]) => (
            <View
              key={title}
              style={styles.infoRow}
            >
              <Icon
                name={icon}
                size={23}
                color={YELLOW}
              />

              <View
                style={
                  styles.infoText
                }
              >
                <Text
                  style={
                    styles.infoTitle
                  }
                >
                  {title}
                </Text>

                <Text
                  style={
                    styles.infoDescription
                  }
                >
                  {description}
                </Text>
              </View>
            </View>
          )
        )}
      </View>
    </ScrollView>
  );
}

/* =========================================================
   APP
========================================================= */

export default function App() {
  const {
    width,
  } = useWindowDimensions();

  const isDesktop =
    width >= 900;

  const isMobile =
    width < 600;

  const [
    screen,
    setScreen,
  ] = useState("home");

  const [
    cases,
    setCases,
  ] = useState([]);

  const [
    selectedIssue,
    setSelectedIssue,
  ] = useState(null);

  const [
    selectedRight,
    setSelectedRight,
  ] = useState(null);

  const [
    analysis,
    setAnalysis,
  ] = useState(null);

  const [
    complaint,
    setComplaint,
  ] = useState("");

  const [
    activeCase,
    setActiveCase,
  ] = useState(null);

  const fade =
    useRef(
      new Animated.Value(1)
    ).current;

  const translate =
    useRef(
      new Animated.Value(0)
    ).current;

  useEffect(() => {
    loadCases();
  }, []);

  async function loadCases() {
    try {
      const stored =
        await AsyncStorage.getItem(
          STORAGE_KEY
        );

      if (stored) {
        setCases(
          JSON.parse(stored)
        );
      }
    } catch (error) {
      console.log(
        "Could not load cases",
        error
      );
    }
  }

  async function persistCases(
    next
  ) {
    setCases(next);

    try {
      await AsyncStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(next)
      );
    } catch (error) {
      console.log(
        "Could not save cases",
        error
      );
    }
  }

  function nav(
    nextScreen
  ) {
    if (
      nextScreen === screen
    ) {
      return;
    }

    Animated.parallel([
      Animated.timing(fade, {
        toValue: 0,
        duration: 100,
        useNativeDriver: true,
      }),

      Animated.timing(
        translate,
        {
          toValue: 8,
          duration: 100,
          useNativeDriver: true,
        }
      ),
    ]).start(() => {
      setScreen(
        nextScreen
      );

      Animated.parallel([
        Animated.timing(
          fade,
          {
            toValue: 1,
            duration: 220,
            useNativeDriver: true,
          }
        ),

        Animated.timing(
          translate,
          {
            toValue: 0,
            duration: 220,
            useNativeDriver: true,
          }
        ),
      ]).start();
    });
  }

  function startIntake(
    issue = null
  ) {
    if (issue) {
      setSelectedIssue(
        issue
      );
    }

    nav("ask");
  }

  function analyze({
    text,
    category,
    issue,
  }) {
    const issueData =
      issue ||
      ISSUES.find(
        (item) =>
          item.title
            .toLowerCase() ===
          String(category)
            .toLowerCase()
      ) ||
      ISSUES[0];

    const rights =
      issueData.rights
        .map((id) =>
          RIGHTS.find(
            (right) =>
              right.id === id
          )
        )
        .filter(Boolean)
        .map(
          (right) =>
            right.title
        );

    const explanation =
      "Your situation appears to involve a consumer transaction or service where the information provided, the quality or safety of the product or service, the way the transaction was handled, or the response to your grievance may be relevant. The exact legal position depends on the facts and documents.";

    const actions = [
      "Write down the timeline: what happened, when it happened and who was involved.",
      "Collect the original transaction, service or purchase records.",
      "Raise the grievance clearly with the concerned business or service provider and keep proof of communication.",
      "Preserve responses, receipts, screenshots and other supporting evidence.",
      "If the grievance remains unresolved, explore the appropriate consumer grievance or professional legal pathway.",
    ];

    const evidence = [
      {
        id: "transaction",
        title:
          "Transaction / purchase record",
        description:
          "Invoice, receipt, booking confirmation or payment record.",
        done: false,
      },

      {
        id: "communication",
        title:
          "Communication",
        description:
          "Emails, messages, complaint numbers or customer-support conversations.",
        done: false,
      },

      {
        id: "screenshots",
        title:
          "Screenshots / photographs",
        description:
          "Relevant listings, advertisements, product condition or service information.",
        done: false,
      },

      {
        id: "terms",
        title:
          "Terms / warranty / policy",
        description:
          "Relevant terms, warranty documents or representations.",
        done: false,
      },

      {
        id: "identity",
        title:
          "Additional supporting documents",
        description:
          "Any other document that helps establish the facts.",
        done: false,
      },
    ];

    setAnalysis({
      text,
      category:
        issueData.title,
      rights,
      explanation,
      actions,
      evidence,
    });

    nav("analysis");
  }

  function toggleEvidence(id) {
    setAnalysis(
      (current) => {
        if (!current) {
          return current;
        }

        return {
          ...current,

          evidence:
            current.evidence.map(
              (item) =>
                item.id === id
                  ? {
                      ...item,
                      done: !item.done,
                    }
                  : item
            ),
        };
      }
    );
  }

  async function saveCase() {
    if (!analysis) {
      return;
    }

    const newCase = {
      id: Date.now().toString(),

      title:
        analysis.category ||
        "Consumer grievance",

      issue:
        analysis.category,

      status: "Draft",

      date:
        new Date().toLocaleDateString(),

      analysis,
    };

    await persistCases([
      newCase,
      ...cases,
    ]);

    setActiveCase(
      newCase
    );

    nav("cases");
  }

  function generateComplaint() {
    if (!analysis) {
      return;
    }

    const evidenceList =
      analysis.evidence
        .filter(
          (item) => item.done
        )
        .map(
          (item) =>
            `- ${item.title}`
        )
        .join("\n");

    const draft = `SUBJECT: Consumer Grievance – ${analysis.category}

To the concerned authority / service provider,

I am writing to formally record a consumer grievance concerning ${analysis.category.toLowerCase()}.

SUMMARY OF THE MATTER

${analysis.text}

RELEVANT CONSUMER CONCERNS

The matter appears to involve the following consumer-rights areas:

${analysis.rights
  .map(
    (item) =>
      `- ${item}`
  )
  .join("\n")}

REQUEST

I request that the matter be reviewed and that an appropriate response or resolution be provided based on the facts, applicable terms and relevant consumer protection mechanisms.

SUPPORTING EVIDENCE

${
  evidenceList ||
  "- Evidence to be attached after review"
}

I am retaining the relevant records and communications relating to this matter.

Sincerely,
[Consumer Name]
[Contact Details]
[Date]`;

    setComplaint(draft);

    nav("complaint");
  }

  const activeScreen =
    useMemo(() => {
      if (screen === "home") {
        return (
          <Home
            nav={nav}
            setSelectedIssue={
              setSelectedIssue
            }
            startIntake={
              startIntake
            }
          />
        );
      }

      if (screen === "rights") {
        return (
          <RightsScreen
            nav={nav}
            setSelectedRight={
              setSelectedRight
            }
          />
        );
      }

      if (screen === "ask") {
        return (
          <AskScreen
            selectedIssue={
              selectedIssue
            }
            setSelectedIssue={
              setSelectedIssue
            }
            analyze={analyze}
            nav={nav}
          />
        );
      }

      if (screen === "analysis") {
        return (
          <AnalysisScreen
            analysis={analysis}
            toggleEvidence={
              toggleEvidence
            }
            saveCase={saveCase}
            generateComplaint={
              generateComplaint
            }
          />
        );
      }

      if (screen === "complaint") {
        return (
          <ComplaintScreen
            complaint={complaint}
            nav={nav}
          />
        );
      }

      if (screen === "cases") {
        return (
          <CasesScreen
            cases={cases}
            nav={nav}
            setActiveCase={
              setActiveCase
            }
          />
        );
      }

      if (screen === "profile") {
        return <ProfileScreen />;
      }

      return null;
    }, [
      screen,
      selectedIssue,
      analysis,
      complaint,
      cases,
    ]);

  return (
    <SafeAreaView
      style={styles.safe}
    >
      <StatusBar
        barStyle="light-content"
        backgroundColor={BLACK}
      />

      <View
        style={
          styles.appBackground
        }
      >
        {isDesktop && (
          <View
            style={
              styles.desktopHeader
            }
          >
            <Logo compact />

            <View
              style={
                styles.desktopNav
              }
            >
              {[
                ["home", "Home"],
                [
                  "rights",
                  "Consumer Rights",
                ],
                [
                  "cases",
                  "My Cases",
                ],
                [
                  "ask",
                  "Ask NyayaSaathi",
                ],
              ].map(
                ([id, label]) => (
                  <Pressable
                    key={id}
                    onPress={() =>
                      nav(id)
                    }
                    style={[
                      styles.desktopNavItem,
                      screen ===
                        id &&
                        styles.desktopNavItemActive,
                    ]}
                  >
                    <Text
                      style={[
                        styles.desktopNavText,
                        screen ===
                          id &&
                          styles.desktopNavTextActive,
                      ]}
                    >
                      {label}
                    </Text>
                  </Pressable>
                )
              )}
            </View>

            <Pressable
              onPress={() =>
                nav("profile")
              }
              style={
                styles.desktopProfile
              }
            >
              <Icon
                name="account-outline"
                size={20}
                color={WHITE}
              />
            </Pressable>
          </View>
        )}

        <View
          style={[
            styles.appShell,
            isDesktop &&
              styles.appShellDesktop,
          ]}
        >
          <Animated.View
            style={{
              flex: 1,
              opacity: fade,
              transform: [
                {
                  translateY:
                    translate,
                },
              ],
            }}
          >
            {activeScreen}
          </Animated.View>

          <BottomNav
            screen={screen}
            nav={nav}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

/* =========================================================
   STYLES
========================================================= */

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: BLACK,
  },

  appBackground: {
    flex: 1,
    backgroundColor: BLACK,
  },

  appShell: {
    flex: 1,
    width: "100%",
    alignSelf: "center",
  },

  appShellDesktop: {
    maxWidth: 1440,
  },

  /* HEADER */

  desktopHeader: {
    height: 74,
    borderBottomWidth: 1,
    borderBottomColor: BORDER,
    paddingHorizontal: 34,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  desktopNav: {
    flexDirection: "row",
    alignItems: "center",
    gap: 28,
  },

  desktopNavItem: {
    paddingVertical: 10,
  },

  desktopNavItemActive: {
    borderBottomWidth: 2,
    borderBottomColor: YELLOW,
  },

  desktopNavText: {
    color: MUTED,
    fontSize: 14,
    fontWeight: "600",
  },

  desktopNavTextActive: {
    color: WHITE,
  },

  desktopProfile: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: BORDER,
    justifyContent: "center",
    alignItems: "center",
  },

  /* SCROLL */

  scrollContent: {
    paddingBottom: 110,
  },

  content: {
    width: "100%",
    maxWidth: 1180,
    alignSelf: "center",
    paddingHorizontal: 24,
  },

  /* LOGO */

  logoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 11,
  },

  logoMark: {
    width: 38,
    height: 38,
    backgroundColor: YELLOW,
    alignItems: "center",
    justifyContent: "center",
  },

  logoText: {
    color: WHITE,
    fontSize: 17,
    fontWeight: "900",
    letterSpacing: 1.8,
  },

  logoSub: {
    color: DIM,
    fontSize: 8,
    fontWeight: "700",
    letterSpacing: 1.1,
    marginTop: 3,
  },

  /* HERO */

  hero: {
    borderBottomWidth: 1,
    borderBottomColor: BORDER,
    paddingHorizontal: 24,
    paddingTop: 28,
    paddingBottom: 30,
  },

  heroTop: {
    width: "100%",
    maxWidth: 1180,
    alignSelf: "center",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  secureBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    borderWidth: 1,
    borderColor: "#28332A",
    paddingHorizontal: 9,
    paddingVertical: 6,
  },

  secureText: {
    color: GREEN,
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 0.8,
  },

  heroContent: {
    width: "100%",
    maxWidth: 1180,
    alignSelf: "center",
    paddingTop: 65,
    paddingBottom: 50,
  },

  heroEyebrow: {
    color: YELLOW,
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 2,
    marginBottom: 18,
  },

  heroTitle: {
    color: WHITE,
    fontSize: 52,
    lineHeight: 58,
    fontWeight: "900",
    letterSpacing: -1.8,
    maxWidth: 850,
  },

  heroTitleMobile: {
    fontSize: 36,
    lineHeight: 41,
    letterSpacing: -1,
  },

  heroDescription: {
    color: MUTED,
    fontSize: 17,
    lineHeight: 27,
    maxWidth: 670,
    marginTop: 20,
  },

  heroActions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginTop: 30,
  },

  heroActionsMobile: {
    flexDirection: "column",
  },

  heroFooter: {
    width: "100%",
    maxWidth: 1180,
    alignSelf: "center",
  },

  heroFooterText: {
    color: DIM,
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.7,
  },

  /* SECTIONS */

  sectionHeader: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    gap: 15,
    marginTop: 48,
    marginBottom: 20,
  },

  sectionHeaderText: {
    flex: 1,
  },

  eyebrow: {
    color: YELLOW,
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 1.7,
    marginBottom: 8,
  },

  sectionTitle: {
    color: WHITE,
    fontSize: 28,
    fontWeight: "800",
    letterSpacing: -0.6,
  },

  sectionDescription: {
    color: MUTED,
    fontSize: 14,
    lineHeight: 21,
    marginTop: 7,
    maxWidth: 650,
  },

  linkText: {
    color: YELLOW,
    fontSize: 13,
    fontWeight: "800",
  },

  divider: {
    height: 1,
    backgroundColor: BORDER,
    marginVertical: 46,
  },

  /* RIGHT CARDS */

  rightCard: {
    width: "100%",
    backgroundColor: PANEL,
    borderWidth: 1,
    borderColor: BORDER,
    padding: 19,
    minHeight: 145,
  },

  numberRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 28,
  },

  rightNumber: {
    color: DIM,
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 1,
  },

  rightTitle: {
    color: WHITE,
    fontSize: 17,
    fontWeight: "800",
    marginBottom: 7,
  },

  rightShort: {
    color: MUTED,
    fontSize: 12,
    lineHeight: 18,
  },

  /* SEARCH */

  searchBox: {
    minHeight: 52,
    borderWidth: 1,
    borderColor: BORDER,
    backgroundColor: PANEL,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    gap: 9,
    marginBottom: 12,
  },

  searchInput: {
    flex: 1,
    minWidth: 0,
    color: WHITE,
    fontSize: 14,
  },

  /* ISSUE */

  issueCard: {
    width: "100%",
    minHeight: 95,
    borderWidth: 1,
    borderColor: BORDER,
    backgroundColor: PANEL,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },

  issueCardText: {
    flex: 1,
    minWidth: 0,
  },

  issueCategory: {
    color: YELLOW,
    fontSize: 9,
    fontWeight: "900",
    letterSpacing: 1,
    marginBottom: 5,
  },

  issueTitle: {
    color: WHITE,
    fontSize: 14,
    fontWeight: "700",
  },

  fullLibrary: {
    marginTop: 4,
    backgroundColor: YELLOW,
    minHeight: 92,
    paddingHorizontal: 22,
    paddingVertical: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 15,
  },

  fullLibraryText: {
    flex: 1,
  },

  fullLibraryEyebrow: {
    color: BLACK,
    fontSize: 9,
    fontWeight: "900",
    letterSpacing: 1.3,
    marginBottom: 5,
  },

  fullLibraryTitle: {
    color: BLACK,
    fontSize: 18,
    fontWeight: "900",
  },

  /* JOURNEY */

  journey: {
    marginTop: 10,
  },

  journeyItem: {
    width: "100%",
    paddingTop: 20,
    paddingRight: 25,
    paddingBottom: 20,
    borderTopWidth: 1,
    borderTopColor: BORDER,
  },

  journeyNumber: {
    color: YELLOW,
    fontSize: 10,
    fontWeight: "900",
    marginBottom: 18,
  },

  journeyTitle: {
    color: WHITE,
    fontSize: 18,
    fontWeight: "800",
    marginBottom: 7,
  },

  journeyDescription: {
    color: MUTED,
    fontSize: 12,
    lineHeight: 18,
    maxWidth: 240,
  },

  /* DISCLAIMER */

  disclaimer: {
    marginTop: 30,
    padding: 15,
    borderWidth: 1,
    borderColor: "#3A3418",
    backgroundColor: "#141208",
    flexDirection: "row",
    gap: 10,
    alignItems: "flex-start",
  },

  disclaimerText: {
    flex: 1,
    color: "#B5AE88",
    fontSize: 11,
    lineHeight: 17,
  },

  /* PAGE HEADER */

  pageHeader: {
    width: "100%",
    maxWidth: 1180,
    alignSelf: "center",
    paddingHorizontal: 24,
    paddingTop: 30,
    paddingBottom: 20,
  },

  pageKicker: {
    color: YELLOW,
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 1.8,
    marginTop: 45,
    marginBottom: 10,
  },

  pageTitle: {
    color: WHITE,
    fontSize: 40,
    lineHeight: 45,
    fontWeight: "900",
    letterSpacing: -1,
  },

  pageTitleMobile: {
    fontSize: 32,
    lineHeight: 37,
  },

  pageDescription: {
    color: MUTED,
    fontSize: 15,
    lineHeight: 23,
    maxWidth: 680,
    marginTop: 12,
  },

  /* RIGHTS */

  largeRightCard: {
    width: "100%",
    minHeight: 220,
    backgroundColor: PANEL,
    borderWidth: 1,
    borderColor: BORDER,
    padding: 22,
  },

  largeRightTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 45,
  },

  largeRightNumber: {
    color: DIM,
    fontSize: 12,
    fontWeight: "900",
    letterSpacing: 1.2,
  },

  largeRightTitle: {
    color: WHITE,
    fontSize: 21,
    fontWeight: "800",
    marginBottom: 9,
  },

  largeRightDescription: {
    color: MUTED,
    fontSize: 13,
    lineHeight: 20,
  },

  learnMore: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    marginTop: 24,
  },

  learnMoreText: {
    color: YELLOW,
    fontSize: 12,
    fontWeight: "800",
  },

  libraryItem: {
    width: "100%",
    minHeight: 75,
    borderWidth: 1,
    borderColor: BORDER,
    backgroundColor: PANEL,
    padding: 15,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },

  libraryItemText: {
    flex: 1,
    minWidth: 0,
  },

  libraryTitle: {
    color: WHITE,
    fontSize: 13,
    fontWeight: "700",
  },

  libraryCategory: {
    color: DIM,
    fontSize: 10,
    marginTop: 4,
  },

  back: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 8,
    marginBottom: 16,
  },

  backText: {
    color: YELLOW,
    fontSize: 13,
    fontWeight: "800",
  },

  rightDetail: {
    padding: 25,
  },

  detailIcon: {
    width: 58,
    height: 58,
    borderWidth: 1,
    borderColor: "#4B4215",
    backgroundColor: "#171507",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 25,
  },

  detailNumber: {
    color: YELLOW,
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 1.5,
  },

  detailTitle: {
    color: WHITE,
    fontSize: 35,
    fontWeight: "900",
    marginTop: 8,
  },

  detailDescription: {
    color: MUTED,
    fontSize: 16,
    lineHeight: 25,
    marginTop: 15,
    maxWidth: 720,
    marginBottom: 35,
  },

  subheading: {
    color: DIM,
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 1.5,
    marginBottom: 15,
  },

  bulletRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    marginBottom: 12,
  },

  bullet: {
    width: 6,
    height: 6,
    backgroundColor: YELLOW,
    marginTop: 7,
  },

  bulletText: {
    flex: 1,
    color: WHITE,
    fontSize: 14,
    lineHeight: 21,
  },

  /* CARD */

  card: {
    backgroundColor: PANEL,
    borderWidth: 1,
    borderColor: BORDER,
    padding: 20,
  },

  /* AI */

  aiCard: {
    padding: 22,
  },

  aiHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 32,
  },

  aiIcon: {
    width: 44,
    height: 44,
    backgroundColor: YELLOW,
    alignItems: "center",
    justifyContent: "center",
  },

  aiTitle: {
    color: WHITE,
    fontSize: 16,
    fontWeight: "800",
  },

  aiStatus: {
    color: YELLOW,
    fontSize: 9,
    fontWeight: "900",
    letterSpacing: 1,
    marginTop: 4,
  },

  label: {
    color: DIM,
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 1.4,
    marginBottom: 10,
  },

  largeInput: {
    minHeight: 170,
    borderWidth: 1,
    borderColor: BORDER,
    backgroundColor: "#090909",
    color: WHITE,
    padding: 15,
    fontSize: 14,
    lineHeight: 22,
    marginBottom: 25,
    textAlignVertical: "top",
  },

  chipScroll: {
    gap: 8,
    paddingBottom: 4,
  },

  selectChip: {
    borderWidth: 1,
    borderColor: BORDER,
    paddingHorizontal: 12,
    paddingVertical: 9,
    backgroundColor: "#0A0A0A",
  },

  selectChipActive: {
    borderColor: YELLOW,
    backgroundColor: "#1A1705",
  },

  selectChipText: {
    color: MUTED,
    fontSize: 11,
    fontWeight: "700",
  },

  selectChipTextActive: {
    color: YELLOW,
  },

  aiFooter: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    marginVertical: 20,
  },

  aiFooterText: {
    color: DIM,
    fontSize: 10,
    flex: 1,
  },

  /* BUTTONS */

  button: {
    minHeight: 48,
    paddingHorizontal: 17,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    alignSelf: "flex-start",
  },

  buttonPrimary: {
    backgroundColor: YELLOW,
  },

  buttonSecondary: {
    borderWidth: 1,
    borderColor: BORDER,
    backgroundColor: PANEL,
  },

  buttonFull: {
    alignSelf: "stretch",
  },

  buttonSmall: {
    minHeight: 40,
    paddingHorizontal: 13,
  },

  buttonText: {
    color: BLACK,
    fontSize: 13,
    fontWeight: "900",
  },

  buttonTextSecondary: {
    color: WHITE,
  },

  buttonTextSmall: {
    fontSize: 11,
  },

  pressed: {
    opacity: 0.72,
  },

  /* NOTES */

  noteBlock: {
    marginTop: 28,
    borderTopWidth: 1,
    borderTopColor: BORDER,
  },

  noteTitle: {
    color: YELLOW,
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 1.5,
    marginTop: 20,
    marginBottom: 15,
  },

  noteRow: {
    flexDirection: "row",
    gap: 15,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#171717",
  },

  noteNumber: {
    color: DIM,
    fontSize: 10,
    fontWeight: "900",
    width: 22,
  },

  noteText: {
    color: MUTED,
    fontSize: 12,
    lineHeight: 19,
    flex: 1,
  },

  textLink: {
    marginTop: 25,
    alignSelf: "center",
  },

  /* ANALYSIS */

  analysisText: {
    color: WHITE,
    fontSize: 16,
    lineHeight: 25,
  },

  analysisSection: {
    marginTop: 10,
  },

  tagsWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },

  tag: {
    borderWidth: 1,
    borderColor: "#4B4215",
    backgroundColor: "#171507",
    paddingHorizontal: 10,
    paddingVertical: 6,
  },

  tagText: {
    color: YELLOW,
    fontSize: 10,
    fontWeight: "800",
  },

  explanation: {
    color: WHITE,
    fontSize: 14,
    lineHeight: 23,
  },

  actionRow: {
    flexDirection: "row",
    gap: 15,
    alignItems: "flex-start",
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: BORDER,
  },

  actionNumber: {
    width: 32,
    height: 32,
    borderWidth: 1,
    borderColor: "#4B4215",
    alignItems: "center",
    justifyContent: "center",
  },

  actionNumberText: {
    color: YELLOW,
    fontSize: 9,
    fontWeight: "900",
  },

  actionText: {
    flex: 1,
    color: WHITE,
    fontSize: 14,
    lineHeight: 22,
    paddingTop: 5,
  },

  evidenceRow: {
    flexDirection: "row",
    gap: 13,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: BORDER,
  },

  checkbox: {
    width: 22,
    height: 22,
    borderWidth: 1,
    borderColor: "#4A4A4A",
    alignItems: "center",
    justifyContent: "center",
  },

  checkboxDone: {
    backgroundColor: YELLOW,
    borderColor: YELLOW,
  },

  evidenceText: {
    flex: 1,
    minWidth: 0,
  },

  evidenceTitle: {
    color: WHITE,
    fontSize: 13,
    fontWeight: "700",
    marginBottom: 4,
  },

  evidenceDescription: {
    color: MUTED,
    fontSize: 11,
    lineHeight: 17,
  },

  twoButtons: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginTop: 22,
  },

  /* COMPLAINT */

  documentCard: {
    padding: 25,
  },

  documentHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: BORDER,
    paddingBottom: 15,
    marginBottom: 20,
  },

  documentLabel: {
    color: YELLOW,
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 1.4,
  },

  documentText: {
    color: WHITE,
    fontSize: 13,
    lineHeight: 22,
  },

  /* CASES */

  caseToolbar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },

  caseCount: {
    color: WHITE,
    fontSize: 30,
    fontWeight: "900",
  },

  caseCountLabel: {
    color: DIM,
    fontSize: 9,
    fontWeight: "900",
    letterSpacing: 1.2,
  },

  caseCard: {
    backgroundColor: PANEL,
    borderWidth: 1,
    borderColor: BORDER,
    padding: 16,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 13,
  },

  caseIcon: {
    width: 45,
    height: 45,
    borderWidth: 1,
    borderColor: "#4B4215",
    backgroundColor: "#171507",
    alignItems: "center",
    justifyContent: "center",
  },

  caseMain: {
    flex: 1,
    minWidth: 0,
  },

  caseTitle: {
    color: WHITE,
    fontSize: 14,
    fontWeight: "800",
  },

  caseIssue: {
    color: MUTED,
    fontSize: 11,
    marginTop: 4,
  },

  caseDate: {
    color: DIM,
    fontSize: 9,
    marginTop: 5,
  },

  emptyState: {
    alignItems: "center",
    paddingVertical: 50,
  },

  emptyTitle: {
    color: WHITE,
    fontSize: 19,
    fontWeight: "800",
    marginTop: 15,
  },

  emptyText: {
    color: MUTED,
    fontSize: 13,
    lineHeight: 20,
    textAlign: "center",
    maxWidth: 450,
    marginVertical: 10,
  },

  /* PROFILE */

  profileCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
  },

  profileIcon: {
    width: 56,
    height: 56,
    borderWidth: 1,
    borderColor: "#4B4215",
    backgroundColor: "#171507",
    alignItems: "center",
    justifyContent: "center",
  },

  profileText: {
    flex: 1,
    minWidth: 0,
  },

  profileTitle: {
    color: WHITE,
    fontSize: 16,
    fontWeight: "800",
  },

  profileDescription: {
    color: MUTED,
    fontSize: 12,
    marginTop: 4,
  },

  infoRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 15,
    paddingVertical: 22,
    borderBottomWidth: 1,
    borderBottomColor: BORDER,
  },

  infoText: {
    flex: 1,
    minWidth: 0,
  },

  infoTitle: {
    color: WHITE,
    fontSize: 14,
    fontWeight: "800",
    marginBottom: 5,
  },

  infoDescription: {
    color: MUTED,
    fontSize: 12,
    lineHeight: 19,
  },

  /* EMPTY */

  emptyScreen: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: BLACK,
  },

  /* BOTTOM NAV */

  bottomNavOuter: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 10,
    paddingBottom: 10,
    backgroundColor: "transparent",
  },

  bottomNav: {
    width: "100%",
    maxWidth: 700,
    alignSelf: "center",
    minHeight: 64,
    backgroundColor: "#0E0E0E",
    borderWidth: 1,
    borderColor: BORDER,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    paddingHorizontal: 4,
  },

  navItem: {
    flex: 1,
    minWidth: 0,
    height: 58,
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },

  navItemActive: {
    borderBottomColor: YELLOW,
  },

  navLabel: {
    color: MUTED,
    fontSize: 9,
    fontWeight: "700",
    textAlign: "center",
  },

  navLabelActive: {
    color: WHITE,
  },
});