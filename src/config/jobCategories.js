const JOB_CATEGORIES = [
  {"site_id":"IDCBT","group_id":"LOCKUP","job_clocking_name":"LOCKUP"},
  {"site_id":"IDCBT","group_id":"VAS","job_clocking_name":"VAS"},
  {"site_id":"IDCBT","group_id":"MAIN WHS","job_clocking_name":"MAIN WHS"},
  {"site_id":"IDCBT","group_id":"Inventory","job_clocking_name":"Inventory"},
  {"site_id":"IDCBT","group_id":"MHE","job_clocking_name":"MHE"},
  {"site_id":"IDCBT","group_id":"Administration","job_clocking_name":"Administration"},
  {"site_id":"IDCBT","group_id":"OTHER","job_clocking_name":"OTHER"},
  {"site_id":"IDCBT","group_id":"BREAK","job_clocking_name":"BREAK"}
];

const JOB_SUBCATEGORIES = [
  {"site_id":"IDCBT","group_id":"LOCKUP","activity_id":10184,"job_clocking_name":"A.Unloading","outOfScope":0},
  {"site_id":"IDCBT","group_id":"MAIN WHS","activity_id":9567,"job_clocking_name":"A.Unloading 20'","outOfScope":1},
  {"site_id":"IDCBT","group_id":"Administration","activity_id":9600,"job_clocking_name":"Admin Inbound","outOfScope":0},
  {"site_id":"IDCBT","group_id":"Administration","activity_id":9602,"job_clocking_name":"Admin INV","outOfScope":0},
  {"site_id":"IDCBT","group_id":"Administration","activity_id":9603,"job_clocking_name":"Admin SAP","outOfScope":0}
];

module.exports = {
  JOB_CATEGORIES,
  JOB_SUBCATEGORIES
}; 