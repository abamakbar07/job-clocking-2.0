const JOB_CATEGORIES = [
    {
      "site_id": "IDCBT",
      "group_id": "LOCKUP",
      "job_clocking_name": "LOCKUP"
    },
    {
      "site_id": "IDCBT",
      "group_id": "VAS",
      "job_clocking_name": "VAS"
    },
    {
      "site_id": "IDCBT",
      "group_id": "MAIN WHS",
      "job_clocking_name": "MAIN WHS"
    },
    {
      "site_id": "IDCBT",
      "group_id": "Inventory",
      "job_clocking_name": "Inventory"
    },
    {
      "site_id": "IDCBT",
      "group_id": "MHE",
      "job_clocking_name": "MHE"
    },
    {
      "site_id": "IDCBT",
      "group_id": "Administration",
      "job_clocking_name": "Administration"
    },
    {
      "site_id": "IDCBT",
      "group_id": "OTHER",
      "job_clocking_name": "OTHER"
    },
    {
      "site_id": "IDCBT",
      "group_id": "BREAK",
      "job_clocking_name": "BREAK"
    }
  ];

const JOB_SUBCATEGORIES = [
    {
      "site_id": "IDCBT",
      "group_id": "LOCKUP",
      "activity_id": 10184,
      "job_clocking_name": "A.Unloading",
      "outOfScope": 0,
      "count_activities": 7
    },
    {
      "site_id": "IDCBT",
      "group_id": "MAIN WHS",
      "activity_id": 9567,
      "job_clocking_name": "A.Unloading 20'",
      "outOfScope": 1,
      "count_activities": 8
    },
    {
      "site_id": "IDCBT",
      "group_id": "MAIN WHS",
      "activity_id": 9571,
      "job_clocking_name": "A.Unloading 40'",
      "outOfScope": 1,
      "count_activities": 8
    },
    {
      "site_id": "IDCBT",
      "group_id": "MAIN WHS",
      "activity_id": 9573,
      "job_clocking_name": "A.Unloading Others",
      "outOfScope": 1,
      "count_activities": 8
    },
    {
      "site_id": "IDCBT",
      "group_id": "MAIN WHS",
      "activity_id": 9572,
      "job_clocking_name": "A.Unloading Wingbox",
      "outOfScope": 1,
      "count_activities": 8
    },
    {
      "site_id": "IDCBT",
      "group_id": "Administration",
      "activity_id": 9600,
      "job_clocking_name": "Admin Inbound",
      "outOfScope": 0,
      "count_activities": 4
    },
    {
      "site_id": "IDCBT",
      "group_id": "Administration",
      "activity_id": 9602,
      "job_clocking_name": "Admin INV",
      "outOfScope": 0,
      "count_activities": 4
    },
    {
      "site_id": "IDCBT",
      "group_id": "Administration",
      "activity_id": 9601,
      "job_clocking_name": "Admin Outbound",
      "outOfScope": 0,
      "count_activities": 4
    },
    {
      "site_id": "IDCBT",
      "group_id": "Administration",
      "activity_id": 9603,
      "job_clocking_name": "Admin SAP",
      "outOfScope": 0,
      "count_activities": 4
    },
    {
      "site_id": "IDCBT",
      "group_id": "LOCKUP",
      "activity_id": 10185,
      "job_clocking_name": "B.JOIN-CHECK",
      "outOfScope": 0,
      "count_activities": 7
    },
    {
      "site_id": "IDCBT",
      "group_id": "LOCKUP",
      "activity_id": 10235,
      "job_clocking_name": "B.PUTAWAY",
      "outOfScope": 0,
      "count_activities": 7
    },
    {
      "site_id": "IDCBT",
      "group_id": "LOCKUP",
      "activity_id": 10233,
      "job_clocking_name": "B.Receiving",
      "outOfScope": 0,
      "count_activities": 7
    },
    {
      "site_id": "IDCBT",
      "group_id": "BREAK",
      "activity_id": 9047,
      "job_clocking_name": "BREAK",
      "outOfScope": 0,
      "count_activities": 1
    },
    {
      "site_id": "IDCBT",
      "group_id": "LOCKUP",
      "activity_id": 10186,
      "job_clocking_name": "C.PICKING",
      "outOfScope": 0,
      "count_activities": 7
    },
    {
      "site_id": "IDCBT",
      "group_id": "MAIN WHS",
      "activity_id": 9576,
      "job_clocking_name": "C.Receiving-Pcs",
      "outOfScope": 0,
      "count_activities": 8
    },
    {
      "site_id": "IDCBT",
      "group_id": "LOCKUP",
      "activity_id": 10187,
      "job_clocking_name": "D.PACKING",
      "outOfScope": 0,
      "count_activities": 7
    },
    {
      "site_id": "IDCBT",
      "group_id": "MAIN WHS",
      "activity_id": 9578,
      "job_clocking_name": "D.Putaway",
      "outOfScope": 0,
      "count_activities": 8
    },
    {
      "site_id": "IDCBT",
      "group_id": "VAS",
      "activity_id": 9072,
      "job_clocking_name": "Documentation",
      "outOfScope": 0,
      "count_activities": 2
    },
    {
      "site_id": "IDCBT",
      "group_id": "LOCKUP",
      "activity_id": 10234,
      "job_clocking_name": "E.Loading&JC",
      "outOfScope": 0,
      "count_activities": 7
    },
    {
      "site_id": "IDCBT",
      "group_id": "MAIN WHS",
      "activity_id": 9049,
      "job_clocking_name": "E.PICKPACK",
      "outOfScope": 0,
      "count_activities": 8
    },
    {
      "site_id": "IDCBT",
      "group_id": "MAIN WHS",
      "activity_id": 9579,
      "job_clocking_name": "G.Loading & JC",
      "outOfScope": 0,
      "count_activities": 8
    },
    {
      "site_id": "IDCBT",
      "group_id": "Inventory",
      "activity_id": 9585,
      "job_clocking_name": "Inventory DCC",
      "outOfScope": 0,
      "count_activities": 3
    },
    {
      "site_id": "IDCBT",
      "group_id": "OTHER",
      "activity_id": 9588,
      "job_clocking_name": "Meeting",
      "outOfScope": 0,
      "count_activities": 5
    },
    {
      "site_id": "IDCBT",
      "group_id": "MHE",
      "activity_id": 9582,
      "job_clocking_name": "MHE",
      "outOfScope": 1,
      "count_activities": 1
    },
    {
      "site_id": "IDCBT",
      "group_id": "Inventory",
      "activity_id": 9586,
      "job_clocking_name": "Movement",
      "outOfScope": 0,
      "count_activities": 3
    },
    {
      "site_id": "IDCBT",
      "group_id": "VAS",
      "activity_id": 16783,
      "job_clocking_name": "VAS",
      "outOfScope": 0,
      "count_activities": 2
    },
    {
      "site_id": "IDCBT",
      "group_id": "Inventory",
      "activity_id": 9598,
      "job_clocking_name": "Verification",
      "outOfScope": 0,
      "count_activities": 3
    },
    {
      "site_id": "IDCBT",
      "group_id": "OTHER",
      "activity_id": 9589,
      "job_clocking_name": "Daystart",
      "outOfScope": 0,
      "count_activities": 5
    },
    {
      "site_id": "IDCBT",
      "group_id": "OTHER",
      "activity_id": 9590,
      "job_clocking_name": "Training",
      "outOfScope": 0,
      "count_activities": 5
    },
    {
      "site_id": "IDCBT",
      "group_id": "OTHER",
      "activity_id": 9591,
      "job_clocking_name": "Housekeeping",
      "outOfScope": 0,
      "count_activities": 5
    },
    {
      "site_id": "IDCBT",
      "group_id": "OTHER",
      "activity_id": 9592,
      "job_clocking_name": "Other",
      "outOfScope": 0,
      "count_activities": 5
    }
  ];

module.exports = {
  JOB_CATEGORIES,
  JOB_SUBCATEGORIES
}; 