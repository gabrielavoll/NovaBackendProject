const creds = require('../creds.json');
const Pool = require('pg').Pool
const pool = new Pool(creds.nova);

module.exports = {
  createTransferInitRecord : (record) => {
    return new Promise( (resolve, reject) => {
      pool.query(
        `
        INSERT INTO transfer_pending (
          file_ext,
          country_code,
          tags,
          token,
          account_id,
          routing_number
        ) VALUES ($1, $2, $3, $4, $5, $6)
        `, record
         , function(error, results) {
          if (error){
            reject(error);
            console.log('insert to transfer_init error', error);
          } else resolve(results.rowCount)
      });
    })
  },
  createTransferRecord : (record) => {
    return new Promise( (resolve, reject) => {
      pool.query(
        `
        INSERT INTO data (
          file_ext,
          country_code,
          account_id,
          routing_number,
          first_name,
          last_name,
          credit_score,
          credit_limit,
          date_t_init,
          tags
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        `, record
        , function(error, results) {
          if (error){
            console.log('insert to transfer error', error);
            reject(error);
          } else resolve(results.rowCount)
      });
    })
  },
  getAllTransferInitRecords : () => {
    return new Promise( (resolve, reject) => {
      pool.query(
        `
        SELECT * FROM transfer_pending
        WHERE 1=1;
        `, function(error, results) {
          if (error){
            console.log('select * transfer_init error', error);
            reject(error);
          } else resolve(results.rows)
      });
    })
  },
  getAllTransferRecords : () => {
    return new Promise( (resolve, reject) => {
      pool.query(
        `
        SELECT * FROM data
        WHERE 1=1;
        `, function(error, results) {
          if (error){
            console.log('select * complete_transfer error', error);
            reject(error)
          } else resolve(results.rows);
      });
    })
  },
  getTransferInitRecord : (token) => {
    return new Promise( (resolve, reject) => {
      pool.query(
        `
        SELECT * FROM transfer_pending
        WHERE token = $1;
        `, [token]
        , function(error, results) {
          if (error){
            //console.log('select ' +  token + ' transfer_init error', error);
            reject(error)
          } else {
            //console.log('success', results.rows);
            resolve(results.rows[0]);
          }
      });
    })
  },
  getTransferRecord : (account_id, routing_number, country_code) => {
    return new Promise( (resolve, reject) => {
      pool.query(
        `
        SELECT * FROM data
        WHERE account_id = $1 AND routing_number = $2 AND country_code = $3;
        `, [account_id, routing_number, country_code]
        , function(error, results) {
          if (error){
            reject(error)
            console.log('select ' +  account_id + ' and ' + country_code + ' complete_transfer error', error);
          } else resolve(results.rows[0])
      });
    })
  },
  getTransferRecordById: (id) => {
    return new Promise( (resolve, reject) => {
      pool.query(
        `
        SELECT * FROM data
        WHERE id = $1;
        `, [id]
        , function(error, results) {
          if (error){
            reject(error)
            console.log('select ' +  account_id + ' and ' + country_code + ' complete_transfer error', error);
          } else resolve(results.rows[0])
      });
    })
  },
  truncateTransferStatusRecords: () => {
    return new Promise( (resolve, reject) => {
      pool.query(
        `
        TRUNCATE transfer_pending;
        `, function(error, results) {
          if (error) reject(error);
          else resolve(results.rows);
      });
    })
  },
  truncateTransferRecords: () => {
    return new Promise( (resolve, reject) => {
      pool.query(
        `
        TRUNCATE data;
        `, function(error, results) {
          if (error) reject(error);
          else resolve(results.rows);
      });
    })
  },
  deleteTransferStatusRecord: (token) => {
    return new Promise( (resolve, reject) => {
      pool.query(
        `
        DELETE FROM transfer_pending
        WHERE token = $1;
        `, [token]
        , function(error, results) {
          if (error) reject(error);
          else resolve(results.rowCount);
      });
    })
  }
}


