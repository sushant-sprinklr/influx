require("dotenv").config();
const assert = require("assert");
const WebSocket = require("ws");
const ws = new WebSocket(process.env.WEB_SOCKET_URL);

const { InfluxDB, Point } = require("@influxdata/influxdb-client");
const { write } = require("fs");
const token = process.env.INFLUXDB_TOKEN;
const url = process.env.SERVER_URL;
const client = new InfluxDB({ url, token });
let org = process.env.ORG_NAME;
let bucket = `testBucket`;
let writeApi = client.getWriteApi(org, bucket, "ns");

ws.addEventListener("message", (e) => {
  var dataString = e.data.toString();
  dataOut = JSON.parse(dataString).data[0];
  //   console.log(dataOut);

  //     .timestamp(dataOut.request_time) -- request_time is an 'invalid timestamp'

  let point = new Point("measurement1")
    .tag("http_status_code", dataOut.http_status_code)
    .tag("uri", dataOut.uri)
    .tag("request_time", dataOut.request_time)
    .stringField("request_host_name", dataOut.request_host_name)
    .stringField("src_ip", dataOut.src_ip)
    .stringField("request_uuid", dataOut.request_uuid)
    .stringField("http_method", dataOut.http_method)
    .stringField("http_version", dataOut.http_version)
    .floatField("bytes", dataOut.bytes)
    .stringField("referrer", dataOut.referrer)
    .stringField("user_agent", dataOut.user_agent)
    .stringField("request_id", dataOut.request_id)
    .stringField("api_key", dataOut.api_key)
    .stringField("service_id", dataOut.service_id)
    .stringField("traffic_manager", dataOut.traffic_manager)
    .stringField("api_method_name", dataOut.api_method_name)
    .floatField("cache_hit", dataOut.cache_hit)
    .stringField(
      "traffic_manager_error_code",
      dataOut.traffic_manager_error_code
    )
    .floatField("total_request_exec_time", dataOut.total_request_exec_time)
    .floatField("remote_total_time", dataOut.remote_total_time)
    .floatField("connect_time", dataOut.connect_time)
    .floatField("pre_transfer_time", dataOut.pre_transfer_time)
    .stringField("oauth_access_token", dataOut.oauth_access_token)
    .floatField("ssl_enabled", dataOut.ssl_enabled)
    .floatField("quota_value", dataOut.quota_value)
    .floatField("qps_throttle_value", dataOut.qps_throttle_value)
    .floatField("client_transfer_time", dataOut.client_transfer_time)
    .stringField("service_name", dataOut.service_name)
    .stringField("response_string", dataOut.response_string)
    .stringField("plan_name", dataOut.plan_name)
    .stringField("plan_uuid", dataOut.plan_uuid)
    .stringField("endpoint_name", dataOut.endpoint_name)
    .stringField("package_name", dataOut.package_name)
    .stringField("package_uuid", dataOut.package_uuid)
    .stringField(
      "service_definition_endpoint_uuid",
      dataOut.service_definition_endpoint_uuid
    )
    .stringField("log_type", dataOut.log_type)
    .floatField("ingestion_time", dataOut.ingestion_time)
    .stringField("org_uuid", dataOut.org_uuid)
    .stringField("org_name", dataOut.org_name)
    .stringField("sub_org_uuid", dataOut.sub_org_uuid)
    .stringField("sub_org_name", dataOut.sub_org_name);
  writeApi.writePoint(point);
  writeApi.flush();
  console.log(point);
});

// for (let i = 0; i < 5; i++) {
//   let point = new Point("measurement1")
//     .tag("tagname1", 5)
//     .intField("field1", i + 1);

//   void setTimeout(() => {
//     writeApi.writePoint(point);
//   }, i * 1000); // separate points by 1 second

//   void setTimeout(() => {
//     writeApi.flush();
//   }, 5000);
// }

// queryClient = client.getQueryApi(org);
// fluxQuery = `from(bucket: "testBucket")
//  |> range(start: -10m)
//  |> filter(fn: (r) => r._measurement == "measurement1")
//  |> mean()`;

// queryClient.queryRows(fluxQuery, {
//   next: (row, tableMeta) => {
//     const tableObject = tableMeta.toObject(row);
//     console.log(tableObject);
//   },
//   error: (error) => {
//     console.error("\nError", error);
//   },
//   complete: () => {
//     console.log("\nSuccess");
//   },
// });
