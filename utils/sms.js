const Core = require('@alicloud/pop-core');

exports.sendSms = (iphone, param, callback) => {
  const Core = require('@alicloud/pop-core');

  let client = new Core({
    accessKeyId: '',
    accessKeySecret: '',
    endpoint: 'https://dysmsapi.aliyuncs.com',
    apiVersion: '2017-05-25'
  });

  let params = {
    "RegionId": "cn-hangzhou",
    "PhoneNumbers": iphone,
    "SignName": "NINE博客",
    "TemplateCode": "SMS_181550169",
    "TemplateParam": param
  }

  let requestOption = {
    method: 'POST'
  };

  return client.request('SendSms', params, requestOption).then(result => {
    callback(result)
  }, ex => {
    callback(ex)
  })

}