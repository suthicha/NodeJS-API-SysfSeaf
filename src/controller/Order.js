var squel = require('squel');
var dbHelper = require('../core/dbHelper');
var httpResponse = require('../core/HttpResponse');
var settings = require('../settings');

exports.getOrders = function(req, resp, fromdate, todate) {

  if (!fromdate && !todate) throw new Error("Input not valid");

  var sqlText = squel.select()
    .from("SEBL1")
    .field("TrxNo")
    .field("ISNULL((SELECT TOP 1 VatRegistrationNo FROM slcu1 WHERE slcu1.CustomerCode=SEBL1.CustomerCode),'') AS TaxNo")
    .field("'' AS BranchNo")
    .field("ISNULL(JobNo,'') AS JobNo")
    .field("ISNULL(BookingNo,'') AS BookingNo")
    .field("ISNULL(CustomerCode,'') AS CustomerNo")
    .field("ISNULL(CustomerName,'') AS CustomerName")
    .field("ISNULL(UcrNo,'') AS CarrierBookingNo")
    .field("ISNULL(OBLNo,'') AS OBL")
    .field("ISNULL(BLNo,'') AS HBL")
    .field("ISNULL(MasterJobNo,'') AS MasterJobNo")
    .field("ISNULL(DestCode,'') AS DestCode")
    .field("ISNULL(DestName,'') AS DestName")
    .field("ISNULL(EtdDate, CONVERT(DATE,'19000101',112)) AS DepartureDate")
    .field("ISNULL(MotherVesselName,'') AS MotherVessel")
    .field("ISNULL(FeederVesselName,'') AS FeederVessel")
    .field("ISNULL(EtaDate, CONVERT(DATE,'19000101',112)) AS ArrivalDate")
    .field("ISNULL(ContainerNo,'') AS ContainerNo")
    .field("ISNULL(DeliveryOrderReleaseDate, CONVERT(DATE,'19000101',112)) AS DeliveryDate")
    .field("ISNULL(PortOfDischargeCode,'') AS PortOfDischargeCode")
    .field("ISNULL(PortOfDischargeName,'') AS PortOfDischargeName")
    .field("ISNULL(PortOfLoadingCode,'') AS PortOfLoadingCode")
    .field("ISNULL(PortOfLoadingName,'') AS PortOfLoadingName")
    .field("ISNULL(VoyageNo,'') AS VoyageNo")
    .field("'' AS Status")
    .field("'' AS Remark")
    .field("'' AS Username")
    .where(
      squel.expr()
        .and("EtdDate >= ?", fromdate)
        .and("EtdDate <= ?", todate)
    )
    .order("MasterJobNo")
    .toString();

    dbHelper.executedWithConnection(sqlText, settings.dbConfigToSysfreight, function(callback, err) { 
      if (err) {
        httpResponse.show500(req, resp, err);
      }
      else { 
        httpResponse.sendJson(req, resp, callback);
      }
    });

}