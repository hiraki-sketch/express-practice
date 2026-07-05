const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

type ReportData = {
  id: string;
  title: string;
  content: string;
  shift: "day" | "evening" | "night";
  troubleLevel: "low" | "middle" | "high";
  createdAt: string;
};

let reports: ReportData[] = [];

app.get("/", (req: any, res: any) => {
  res.json({ message: "Express API is running" });
});

app.get("/reports", (req: any, res: any) => {
  res.json(reports);
});

app.post("/reports", (req: any, res: any) => {
  const { title, content, shift, troubleLevel } = req.body;

  if (!title || !content || !shift || !troubleLevel) {
    return res.status(400).json({ message: "必要な項目が足りません" });
  }

  const report: ReportData = {
    id: crypto.randomUUID(),
    title,
    content,
    shift,
    troubleLevel,
    createdAt: new Date().toISOString(),
  };

  reports.push(report);

  res.status(201).json(report);
});
app.get("/reports/:id", (req: any, res: any) => {
  const report = reports.find((report) => report.id === req.params.id);

  if (!report) {
    return res.status(404).json({ message: "日報が見つかりません" });
  }

  res.json(report);
});
app.put("/reports/:id", (req: any, res: any) => {
    const report = reports.find((report) => report.id === req.params.id);
    if (!report) {
        return res.status(404).json({ message: "日報が見つかりません" });
    }
    const { title, content, shift, troubleLevel } = req.body;

    if (!title || !content || !shift || !troubleLevel) {
        return res.status(400).json({ message: "必要な項目が足りません" });
    }

    report.title = title;
    report.content = content;
    report.shift = shift;
    report.troubleLevel = troubleLevel;

    res.json(report);
});
app.delete("/reports/:id", (req: any, res: any) => {
    const reportIndex = reports.findIndex((report) => report.id === req.params.id);
    if (reportIndex === -1) {
        return res.status(404).json({ message: "日報が見つかりません" });
    }
    reports = reports.filter((_, index) => index !== reportIndex);
   res.status(204).send();
});
app.listen(3001, () => {
  console.log("Server is running on http://localhost:3001");
});