// Mock data for space biology experiments
export const mockExperiments = [
  {
    id: "GLDS-47",
    title: "Effects of Spaceflight on Mouse Liver Gene Expression",
    organism: "Mus musculus (Mouse)",
    mission: "Space Shuttle STS-135",
    date: "2011-07-08",
    description: "This study examines the effects of spaceflight on gene expression in mouse liver. Mice were flown on the Space Shuttle STS-135 mission for approximately 13 days."
  },
  {
    id: "GLDS-168",
    title: "Rodent Research-5: Effects of Spaceflight on Musculoskeletal System",
    organism: "Mus musculus (Mouse)",
    mission: "ISS Expedition 52/53",
    date: "2017-08-14",
    description: "This study investigates the effects of spaceflight on the musculoskeletal system in mice during a 30-day mission on the International Space Station."
  },
  {
    id: "GLDS-120",
    title: "Plant Growth in Microgravity",
    organism: "Arabidopsis thaliana (Thale cress)",
    mission: "ISS Expedition 39/40",
    date: "2014-04-18",
    description: "This experiment studies how plants grow and develop in the microgravity environment of space, focusing on gene expression changes in Arabidopsis seedlings."
  },
  {
    id: "GLDS-258",
    title: "Bacterial Growth and Antibiotic Resistance in Space",
    organism: "Escherichia coli",
    mission: "ISS Expedition 60",
    date: "2019-07-20",
    description: "This study examines how the space environment affects bacterial growth patterns and antibiotic resistance in E. coli cultures."
  },
  {
    id: "GLDS-173",
    title: "Effects of Space Radiation on Human Cell Lines",
    organism: "Homo sapiens",
    mission: "ISS Expedition 54/55",
    date: "2018-01-15",
    description: "This experiment investigates the effects of space radiation on human cell lines, focusing on DNA damage and repair mechanisms."
  },
  {
    id: "GLDS-194",
    title: "Immune System Response to Spaceflight",
    organism: "Mus musculus (Mouse)",
    mission: "ISS Expedition 56/57",
    date: "2018-06-06",
    description: "This study examines how spaceflight affects immune system function in mice, with a focus on T-cell activation and cytokine production."
  },
  {
    id: "GLDS-212",
    title: "Microbial Communities in Space Habitats",
    organism: "Multiple microbial species",
    mission: "ISS Expedition 58/59",
    date: "2019-03-14",
    description: "This experiment characterizes the microbial communities that develop in space habitats and how they differ from those on Earth."
  },
  {
    id: "GLDS-89",
    title: "Fruit Fly Development in Space",
    organism: "Drosophila melanogaster",
    mission: "ISS Expedition 42/43",
    date: "2015-01-10",
    description: "This study investigates how the space environment affects development and gene expression in fruit flies across multiple generations."
  },
  {
    id: "GLDS-145",
    title: "Bone Loss Countermeasures in Space",
    organism: "Mus musculus (Mouse)",
    mission: "ISS Expedition 50/51",
    date: "2016-11-17",
    description: "This experiment tests potential countermeasures for bone loss during spaceflight using a mouse model."
  },
  {
    id: "GLDS-237",
    title: "Plant Stress Responses in Microgravity",
    organism: "Arabidopsis thaliana (Thale cress)",
    mission: "ISS Expedition 61/62",
    date: "2019-10-03",
    description: "This study examines how plants respond to environmental stresses in the microgravity environment of space."
  }
];

// Mock experiment details
export const mockExperimentDetails = {
  "GLDS-47": {
    id: "GLDS-47",
    title: "Effects of Spaceflight on Mouse Liver Gene Expression",
    organism: "Mus musculus (Mouse)",
    tissue: "Liver",
    mission: "Space Shuttle STS-135",
    date: "2011-07-08",
    description: "This study examines the effects of spaceflight on gene expression in mouse liver. Mice were flown on the Space Shuttle STS-135 mission for approximately 13 days. The experiment aimed to identify genes and pathways affected by microgravity and space radiation, with implications for human health during long-duration space missions.",
    samples: [
      { id: "STS135-L1", type: "Flight", condition: "Spaceflight" },
      { id: "STS135-L2", type: "Flight", condition: "Spaceflight" },
      { id: "STS135-L3", type: "Flight", condition: "Spaceflight" },
      { id: "STS135-L4", type: "Ground Control", condition: "Earth gravity" },
      { id: "STS135-L5", type: "Ground Control", condition: "Earth gravity" },
      { id: "STS135-L6", type: "Ground Control", condition: "Earth gravity" }
    ]
  },
  "GLDS-168": {
    id: "GLDS-168",
    title: "Rodent Research-5: Effects of Spaceflight on Musculoskeletal System",
    organism: "Mus musculus (Mouse)",
    tissue: "Skeletal muscle, Bone",
    mission: "ISS Expedition 52/53",
    date: "2017-08-14",
    description: "This study investigates the effects of spaceflight on the musculoskeletal system in mice during a 30-day mission on the International Space Station. The research focuses on muscle atrophy and bone loss, which are significant health concerns for astronauts during long-duration spaceflight. The experiment also tests a potential drug treatment to prevent muscle and bone loss in microgravity.",
    samples: [
      { id: "RR5-M1", type: "Flight", condition: "Spaceflight" },
      { id: "RR5-M2", type: "Flight", condition: "Spaceflight + Treatment" },
      { id: "RR5-M3", type: "Flight", condition: "Spaceflight" },
      { id: "RR5-M4", type: "Flight", condition: "Spaceflight + Treatment" },
      { id: "RR5-M5", type: "Ground Control", condition: "Earth gravity" },
      { id: "RR5-M6", type: "Ground Control", condition: "Earth gravity + Treatment" },
      { id: "RR5-M7", type: "Ground Control", condition: "Earth gravity" },
      { id: "RR5-M8", type: "Ground Control", condition: "Earth gravity + Treatment" }
    ]
  },
  "GLDS-120": {
    id: "GLDS-120",
    title: "Plant Growth in Microgravity",
    organism: "Arabidopsis thaliana (Thale cress)",
    tissue: "Whole seedling",
    mission: "ISS Expedition 39/40",
    date: "2014-04-18",
    description: "This experiment studies how plants grow and develop in the microgravity environment of space, focusing on gene expression changes in Arabidopsis seedlings. Understanding plant growth in space is crucial for developing sustainable life support systems for long-duration space missions and potential space colonies. The study examines changes in genes related to phototropism, gravitropism, and cell wall development.",
    samples: [
      { id: "APEX03-P1", type: "Flight", condition: "Microgravity" },
      { id: "APEX03-P2", type: "Flight", condition: "Microgravity" },
      { id: "APEX03-P3", type: "Flight", condition: "Microgravity" },
      { id: "APEX03-P4", type: "Ground Control", condition: "Earth gravity" },
      { id: "APEX03-P5", type: "Ground Control", condition: "Earth gravity" },
      { id: "APEX03-P6", type: "Ground Control", condition: "Earth gravity" }
    ]
  }
};

// Mock gene expression data
export const mockGeneData = {
  "GLDS-47": [
    { gene_symbol: "ACTA1", fold_change: 2.8, p_value: 0.001, description: "Actin, alpha 1, skeletal muscle" },
    { gene_symbol: "MYH7", fold_change: 2.5, p_value: 0.002, description: "Myosin heavy chain 7, cardiac muscle, beta" },
    { gene_symbol: "FOXO1", fold_change: 1.9, p_value: 0.008, description: "Forkhead box O1" },
    { gene_symbol: "TRIM63", fold_change: 1.8, p_value: 0.01, description: "Tripartite motif containing 63" },
    { gene_symbol: "FBXO32", fold_change: 1.7, p_value: 0.015, description: "F-box protein 32" },
    { gene_symbol: "MSTN", fold_change: 1.6, p_value: 0.02, description: "Myostatin" },
    { gene_symbol: "IGF1", fold_change: -1.5, p_value: 0.025, description: "Insulin-like growth factor 1" },
    { gene_symbol: "PPARGC1A", fold_change: -1.6, p_value: 0.018, description: "PPARG coactivator 1 alpha" },
    { gene_symbol: "PRKAA2", fold_change: -1.7, p_value: 0.012, description: "Protein kinase AMP-activated catalytic subunit alpha 2" },
    { gene_symbol: "TFAM", fold_change: -1.8, p_value: 0.009, description: "Transcription factor A, mitochondrial" }
  ],
  "GLDS-168": [
    { gene_symbol: "COL1A1", fold_change: -2.1, p_value: 0.005, description: "Collagen type I alpha 1 chain" },
    { gene_symbol: "BGLAP", fold_change: -2.0, p_value: 0.007, description: "Bone gamma-carboxyglutamate protein (Osteocalcin)" },
    { gene_symbol: "SPP1", fold_change: -1.9, p_value: 0.009, description: "Secreted phosphoprotein 1 (Osteopontin)" },
    { gene_symbol: "TNFSF11", fold_change: 1.8, p_value: 0.01, description: "TNF superfamily member 11 (RANKL)" },
    { gene_symbol: "CTSK", fold_change: 1.7, p_value: 0.015, description: "Cathepsin K" },
    { gene_symbol: "MMP9", fold_change: 1.6, p_value: 0.02, description: "Matrix metallopeptidase 9" },
    { gene_symbol: "RUNX2", fold_change: -1.5, p_value: 0.025, description: "RUNX family transcription factor 2" },
    { gene_symbol: "ALPL", fold_change: -1.6, p_value: 0.018, description: "Alkaline phosphatase, liver/bone/kidney" },
    { gene_symbol: "SOST", fold_change: 1.7, p_value: 0.012, description: "Sclerostin" },
    { gene_symbol: "DKK1", fold_change: 1.8, p_value: 0.009, description: "Dickkopf WNT signaling pathway inhibitor 1" }
  ],
  "GLDS-120": [
    { gene_symbol: "ATHB-7", fold_change: 2.3, p_value: 0.003, description: "Arabidopsis thaliana homeobox 7" },
    { gene_symbol: "DREB2A", fold_change: 2.1, p_value: 0.005, description: "Dehydration-responsive element-binding protein 2A" },
    { gene_symbol: "RD29A", fold_change: 2.0, p_value: 0.007, description: "Responsive to desiccation 29A" },
    { gene_symbol: "ERD10", fold_change: 1.9, p_value: 0.009, description: "Early responsive to dehydration 10" },
    { gene_symbol: "COR15A", fold_change: 1.8, p_value: 0.01, description: "Cold-regulated 15A" },
    { gene_symbol: "XTH9", fold_change: 1.7, p_value: 0.015, description: "Xyloglucan endotransglucosylase/hydrolase 9" },
    { gene_symbol: "EXPA8", fold_change: 1.6, p_value: 0.02, description: "Expansin A8" },
    { gene_symbol: "RBCS1A", fold_change: -1.7, p_value: 0.012, description: "Ribulose bisphosphate carboxylase small chain 1A" },
    { gene_symbol: "CAB1", fold_change: -1.8, p_value: 0.009, description: "Chlorophyll A/B binding protein 1" },
    { gene_symbol: "LHCB1.3", fold_change: -1.9, p_value: 0.008, description: "Light-harvesting chlorophyll B-binding protein 1.3" }
  ]
};
