const handleLogEntry = async (event: string, msg: any): Promise<void> => {
  return
  // if (!msg.timestamp) return
  //
  // await db.writeEntry({
  //   type: event,
  //   userID: msg.user_id,
  //   appID: msg.app_id,
  //   organizationID: msg.organization_id,
  //   log: msg.log,
  //   timestamp: msg.timestamp,
  // })
}

export default { handleLogEntry }