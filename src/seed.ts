import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const colors = [
  { hex: "#FFD699" }, // amareloPastel
  { hex: "#FF99CC" }, // rosaPastel
  { hex: "#99CCFF" }, // azulPastel
  { hex: "#99FFCC" }, // verdePastel
  { hex: "#FFA852" }, // laranjaPastel
  { hex: "#CCFF99" }, // verdeLimaPastel
  { hex: "#FF99AA" }, // salmaoPastel
  { hex: "#FFAA99" }, // pessegoPastel
  { hex: "#99FFAA" }, // verdeAguaPastel
  { hex: "#AA99FF" }, // lilasPastel
  { hex: "#FF9999" }, // vermelhoPastel
  { hex: "#CC99CC" }, // rosinPastel
];

const icons = [
  { name: "x" },
  { name: "book-open-text" },
  { name: "party-popper" },
  { name: "user-round" },
  { name: "shopping-basket" },
  { name: "shirt" },
  { name: "dumbbell" },
  { name: "hammer" },
  { name: "bus" },
  { name: "plane" },
  { name: "paw-print" },
  { name: "coffee" },
  { name: "ham" },
];

async function seedDatabase() {
  try {
    for (const color of colors) {
      await prisma.color.upsert({
        where: { hex: color.hex },
        update: {},
        create: color,
      });
    }
    console.log("cores inseridas com sucesso!");

    for (const icon of icons) {
      await prisma.icon.upsert({
        where: { name: icon.name },
        update: {},
        create: icon,
      });
    }
    console.log("icones inseridos !");

  } catch (e) {
    console.error("nao rodou o seed:", e);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
    console.log("Desconectado do banco");
  }
}

seedDatabase();
