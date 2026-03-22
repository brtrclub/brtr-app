import "dotenv/config"
import { PrismaClient, AvatarColor, UserRole, TeamRole, AssignmentStatus, SessionStatus, ThreadStatus, PathStatus, TopicType } from "@prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"
import pg from "pg"
import * as bcrypt from "bcryptjs"

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
  console.log("Seeding database...")

  // Clear existing data
  await prisma.aMAMessage.deleteMany()
  await prisma.aMAThread.deleteMany()
  await prisma.topic.deleteMany()
  await prisma.learningWeek.deleteMany()
  await prisma.learningPath.deleteMany()
  await prisma.mentorAssignment.deleteMany()
  await prisma.teamMember.deleteMany()
  await prisma.team.deleteMany()
  await prisma.mentor.deleteMany()
  await prisma.user.deleteMany()
  await prisma.organization.deleteMany()

  // Create Organization
  const org = await prisma.organization.create({
    data: {
      name: "QuickReply.ai",
      slug: "quickreply-ai",
      industry: "SaaS",
      size: "SMALL",
    },
  })

  // Create Users
  const hashedPassword = await bcrypt.hash("password123", 10)

  // QuickReply.ai Team Members
  const anirudh = await prisma.user.create({
    data: {
      email: "anirudh@quickreply.ai",
      name: "Anirudh Moza",
      passwordHash: hashedPassword,
      avatarColor: AvatarColor.AMBER,
      role: UserRole.TEAM_MEMBER,
    },
  })

  const steffi = await prisma.user.create({
    data: {
      email: "steffi@quickreply.ai",
      name: "Steffi Emmanuel",
      passwordHash: hashedPassword,
      avatarColor: AvatarColor.COPPER,
      role: UserRole.TEAM_MEMBER,
    },
  })

  const arpit = await prisma.user.create({
    data: {
      email: "arpit@quickreply.ai",
      name: "Arpit Rawat",
      passwordHash: hashedPassword,
      avatarColor: AvatarColor.SILVER,
      role: UserRole.TEAM_MEMBER,
    },
  })

  const rahul = await prisma.user.create({
    data: {
      email: "rahul@quickreply.ai",
      name: "Rahul Kumar",
      passwordHash: hashedPassword,
      avatarColor: AvatarColor.AMBER,
      role: UserRole.TEAM_MEMBER,
    },
  })

  // Admin user (for viewing all chats in demos)
  const admin = await prisma.user.create({
    data: {
      email: "admin@quickreply.ai",
      name: "Admin",
      passwordHash: hashedPassword,
      avatarColor: AvatarColor.AMBER,
      role: UserRole.ORG_ADMIN,
    },
  })

  // Create Team
  const quickreplyTeam = await prisma.team.create({
    data: {
      name: "QuickReply.ai",
      slug: "quickreply-ai",
      organizationId: org.id,
    },
  })

  // Add Team Members
  const [anirudhTM, steffiTM, arpitTM, rahulTM] = await Promise.all([
    prisma.teamMember.create({
      data: {
        team: { connect: { id: quickreplyTeam.id } },
        user: { connect: { id: anirudh.id } },
        role: TeamRole.LEAD
      },
    }),
    prisma.teamMember.create({
      data: {
        team: { connect: { id: quickreplyTeam.id } },
        user: { connect: { id: steffi.id } },
        role: TeamRole.MEMBER
      },
    }),
    prisma.teamMember.create({
      data: {
        team: { connect: { id: quickreplyTeam.id } },
        user: { connect: { id: arpit.id } },
        role: TeamRole.MEMBER
      },
    }),
    prisma.teamMember.create({
      data: {
        team: { connect: { id: quickreplyTeam.id } },
        user: { connect: { id: rahul.id } },
        role: TeamRole.MEMBER
      },
    }),
  ])

  // Create Mentor - Haider Ali
  const haider = await prisma.mentor.create({
    data: {
      name: "Haider Ali",
      email: "haider@brtr.club",
      avatarColor: AvatarColor.SILVER,
      headline: "Revenue & Operations",
      company: "Shoops",
      bio: "Operations expert with experience at fast-growing D2C and B2B companies. Specializes in building scalable sales processes and revenue operations.",
      expertise: ["Revenue Operations", "Sales Strategy", "Process Optimization", "GTM"],
      timezone: "Asia/Kolkata",
      isActive: true,
    },
  })

  // Assign Haider to team members
  await Promise.all([
    prisma.mentorAssignment.create({
      data: {
        mentor: { connect: { id: haider.id } },
        teamMember: { connect: { id: anirudhTM.id } },
        assignedBy: { connect: { id: admin.id } },
        status: AssignmentStatus.ACTIVE,
      },
    }),
    prisma.mentorAssignment.create({
      data: {
        mentor: { connect: { id: haider.id } },
        teamMember: { connect: { id: steffiTM.id } },
        assignedBy: { connect: { id: admin.id } },
        status: AssignmentStatus.ACTIVE,
      },
    }),
    prisma.mentorAssignment.create({
      data: {
        mentor: { connect: { id: haider.id } },
        teamMember: { connect: { id: arpitTM.id } },
        assignedBy: { connect: { id: admin.id } },
        status: AssignmentStatus.ACTIVE,
      },
    }),
    prisma.mentorAssignment.create({
      data: {
        mentor: { connect: { id: haider.id } },
        teamMember: { connect: { id: rahulTM.id } },
        assignedBy: { connect: { id: admin.id } },
        status: AssignmentStatus.ACTIVE,
      },
    }),
  ])

  // Create AMA Thread with Haider
  const amaThread = await prisma.aMAThread.create({
    data: {
      title: "AMA with Haider Ali",
      topic: "Sales Data Sources & GTM Strategy",
      status: ThreadStatus.OPEN,
      mentor: { connect: { id: haider.id } },
    },
  })

  // Create AMA Messages - conversation between team and Haider
  // Using individual creates instead of createMany for relation compatibility
  await prisma.aMAMessage.create({
    data: {
      thread: { connect: { id: amaThread.id } },
      author: { connect: { id: anirudh.id } },
      content: null,
      voiceUrl: "/audio/anirudh-question-1.mp3",
      voiceDuration: 42,
      transcription: "I've completely exhausted my Apollo list for fintech mid-market. Sales Nav is giving me the same people. Where else do I pull data from?",
      isFromMentor: false,
    },
  })
  await prisma.aMAMessage.create({
    data: {
      thread: { connect: { id: amaThread.id } },
      author: { connect: { id: admin.id } },
      content: 'Apollo + Nav will always overlap. Try Crunchbase for recently funded fintechs — filter Series A/B, last 6 months. Then scrape their hiring pages for "head of revenue" or "sales ops" listings. If they\'re hiring, they\'re scaling. That\'s your buying signal, not the contact database.',
      isFromMentor: true,
    },
  })
  await prisma.aMAMessage.create({
    data: {
      thread: { connect: { id: amaThread.id } },
      author: { connect: { id: steffi.id } },
      content: null,
      voiceUrl: "/audio/steffi-question-1.mp3",
      voiceDuration: 35,
      transcription: "For product marketing, how do we position QuickReply against competitors who have bigger budgets? What's worked for you?",
      isFromMentor: false,
    },
  })
  await prisma.aMAMessage.create({
    data: {
      thread: { connect: { id: amaThread.id } },
      author: { connect: { id: admin.id } },
      content: "Don't compete on features or budget. Compete on specificity. Pick one use case you absolutely nail — like WhatsApp automation for D2C brands — and own that narrative completely. Your competitors are trying to be everything. You be the best at one thing.",
      isFromMentor: true,
    },
  })
  await prisma.aMAMessage.create({
    data: {
      thread: { connect: { id: amaThread.id } },
      author: { connect: { id: rahul.id } },
      content: null,
      voiceUrl: "/audio/rahul-question-1.mp3",
      voiceDuration: 28,
      transcription: "What SEO strategies have you seen work best for B2B SaaS? Should we focus on bottom-funnel keywords or build topical authority first?",
      isFromMentor: false,
    },
  })
  await prisma.aMAMessage.create({
    data: {
      thread: { connect: { id: amaThread.id } },
      author: { connect: { id: admin.id } },
      content: "For early-stage SaaS, bottom-funnel first. Capture the 3% who are ready to buy now. Build pages for 'best [your category] tools', '[competitor] alternatives', and pricing comparison content. Topical authority is a long game — play it once you have revenue.",
      isFromMentor: true,
    },
  })

  // Create Learning Paths for team members
  await prisma.learningPath.create({
    data: {
      title: "Ads & Outbound Mastery",
      description: "Advanced curriculum for scaling paid acquisition and outbound",
      totalWeeks: 4,
      status: PathStatus.ACTIVE,
      user: { connect: { id: anirudh.id } },
      team: { connect: { id: quickreplyTeam.id } },
      weeks: {
        create: [
          {
            weekNumber: 1,
            title: "Outbound Fundamentals",
            objectives: ["Master cold email sequences", "Build targeted prospect lists"],
            topics: {
              create: [
                { title: "1:1 with Haider", type: TopicType.SESSION, durationMinutes: 30, order: 0 },
                { title: "Async reading: Cold Email Playbook", type: TopicType.ARTICLE, durationMinutes: 45, order: 1 },
              ],
            },
          },
          {
            weekNumber: 2,
            title: "Paid Ads Strategy",
            objectives: ["Set up tracking & attribution", "Optimize ad spend ROI"],
            topics: {
              create: [
                { title: "Group session: Ads Deep Dive", type: TopicType.SESSION, durationMinutes: 60, order: 0 },
                { title: "Hands-on: Campaign Setup", type: TopicType.EXERCISE, durationMinutes: 90, order: 1 },
              ],
            },
          },
        ],
      },
    },
  })

  await prisma.learningPath.create({
    data: {
      title: "Product Marketing Excellence",
      description: "Building compelling narratives and positioning",
      totalWeeks: 4,
      status: PathStatus.ACTIVE,
      user: { connect: { id: steffi.id } },
      team: { connect: { id: quickreplyTeam.id } },
      weeks: {
        create: [
          {
            weekNumber: 1,
            title: "Positioning & Messaging",
            objectives: ["Craft unique value proposition", "Competitive differentiation"],
            topics: {
              create: [
                { title: "1:1 with Haider", type: TopicType.SESSION, durationMinutes: 30, order: 0 },
                { title: "Workshop: Messaging Framework", type: TopicType.EXERCISE, durationMinutes: 60, order: 1 },
              ],
            },
          },
        ],
      },
    },
  })

  await prisma.learningPath.create({
    data: {
      title: "SEO Growth Path",
      description: "Driving organic traffic and conversions",
      totalWeeks: 4,
      status: PathStatus.ACTIVE,
      user: { connect: { id: rahul.id } },
      team: { connect: { id: quickreplyTeam.id } },
      weeks: {
        create: [
          {
            weekNumber: 1,
            title: "Technical SEO",
            objectives: ["Site audit & optimization", "Core web vitals"],
            topics: {
              create: [
                { title: "1:1 with Haider", type: TopicType.SESSION, durationMinutes: 30, order: 0 },
                { title: "Async: SEO Audit Guide", type: TopicType.ARTICLE, durationMinutes: 45, order: 1 },
              ],
            },
          },
        ],
      },
    },
  })

  console.log("Database seeded successfully!")
  console.log({
    organization: org.name,
    users: 5,
    team: quickreplyTeam.name,
    mentor: haider.name,
    amaThreads: 1,
    learningPaths: 3,
  })
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
