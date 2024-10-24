import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedDatabase() {
  // Adicionando cores
  await prisma.color.deleteMany();

  await prisma.color.createMany({
    data: [
      { hex: "#FFD699" }, // amareloPastel
      { hex: "#FF99CC" }, // rosaPastel
      { hex: "#99CCFF" }, //  azulPastel
      { hex: "#99FFCC" }, //verdePastel
      { hex: "#FFA852" }, // laranjaPastel
      { hex: "#CCFF99" }, // verdeLimaPastel
      { hex: "#FF99AA" }, // salmaoPastel
      { hex: "#FFAA99" }, // pessegoPastel
      { hex: "#99FFAA" }, // verdeAguaPastel
      { hex: "#AA99FF" }, //lilasPastel
      { hex: "#FF9999" }, // vermelhoPastel
      { hex: "#CC99CC" }, // rosinPastel
    ],
  });

  // Adicionando ícones
  await prisma.icon.createMany({
    data: [
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
      // Adicione mais ícones conforme necessário
    ],
  });

  console.log("Seed data added successfully.");
}

seedDatabase().catch(e => {
  console.error(e);
  process.exit(1);
});
