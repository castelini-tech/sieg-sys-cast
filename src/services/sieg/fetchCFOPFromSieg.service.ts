import axios from "axios";
import { getCFOPsFromNFe, xmlToJson } from "../../utils/helpers";
import { INFeSiefCFOP } from "../../types/NFeSiefCFOP";

export async function fetchCFOPFromSieg(nfeKey: string): Promise<string[]> {
    const response = await axios.get(
        `https://cofre.sieg.com/ajax/downloadxml?nfe=${nfeKey}`,
        {
            responseType: "text",
            headers: {
                "accept":
                    "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
                "accept-language": "pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7",
                "priority": "u=0, i",
                "sec-ch-ua": `"Chromium";v="142", "Google Chrome";v="142", "Not_A Brand";v="24"`,
                "sec-ch-ua-mobile": "?1",
                "sec-ch-ua-platform": `"Android"`,
                "sec-fetch-dest": "document",
                "sec-fetch-mode": "navigate",
                "sec-fetch-site": "none",
                "sec-fetch-user": "?1",
                "upgrade-insecure-requests": "1",
                "user-agent":
                    "Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Mobile Safari/537.36",
                Cookie:
                    "_fbp=fb.1.1751282009909.242854633332685849; rdtrk=%7B%22id%22%3A%227e52338c-9e0b-41d5-970e-9ddd90ba1c19%22%7D; _sleek_session=%7B%22init%22%3A%222025-07-07T11%3A51%3A14.175Z%22%7D; _hjSessionUser_3570950=eyJpZCI6IjFhZjMzN2VjLThkMTAtNTcxNS05YzhjLTExYjJmZDhiYzVhYSIsImNyZWF0ZWQiOjE3NTE4ODkwNzUwMjAsImV4aXN0aW5nIjp0cnVlfQ==; _hjSessionUser_6467667=eyJpZCI6IjIyZGRlYzNlLTE5MDQtNTdlMy05YzMyLWFjOWI5NTdjODM1MiIsImNyZWF0ZWQiOjE3NTMwOTcwMDE3MzIsImV4aXN0aW5nIjp0cnVlfQ==; _BEAMER_USER_ID_fxzWhwyU5092=ad3606be-059b-490c-9f7f-3522bc3933fe; _BEAMER_FIRST_VISIT_fxzWhwyU5092=2025-07-21T11:23:59.568Z; btab_6558=%7B%22eid%22%3A%226558%22%2C%22variation%22%3A%226536%22%2C%22conversion%22%3A0%2C%22goals%22%3A%5B%5D%7D; btab_6701=%7B%22eid%22%3A%226701%22%2C%22variation%22%3A%226643%22%2C%22conversion%22%3A0%2C%22goals%22%3A%5B%5D%7D; _gcl_au=1.1.1682637391.1759157028; last_pys_landing_page=https://www.sieg.com/; _gcl_aw=GCL.1762956475.CjwKCAiA_dDIBhB6EiwAvzc1cJMBI71wMGI59Nqh0b0GJrDQQXNhb_r3NZCUsJDBBVl1wYHKN6MhlRoC6XQQAvD_BwE; _gcl_gs=2.1.k1$i1762956473$u233219612; darkModeCookie=On; last_pysTrafficSource=direct; mp_94d7af2c41b4289c1669fd791585b5cc_mixpanel=%7B%22distinct_id%22%3A270426%2C%22%24device_id%22%3A%2232fdc180-fa27-46a2-880b-614614d7f724%22%2C%22%24initial_referrer%22%3A%22https%3A%2F%2Fhub.sieg.com%2F%22%2C%22%24initial_referring_domain%22%3A%22hub.sieg.com%22%2C%22__mps%22%3A%7B%7D%2C%22__mpso%22%3A%7B%7D%2C%22__mpus%22%3A%7B%7D%2C%22__mpa%22%3A%7B%7D%2C%22__mpu%22%3A%7B%7D%2C%22__mpr%22%3A%5B%5D%2C%22__mpap%22%3A%5B%5D%2C%22%24user_id%22%3A270426%2C%22CompanyId%22%3A%5B30977%5D%7D; AMP_79eb0fee7c=JTdCJTIyZGV2aWNlSWQlMjIlM0ElMjI0OTIxOTQ0NC0yMGExLTRjYWMtYTAyZC02M2U0ZmU0MjIzMTElMjIlMkMlMjJzZXNzaW9uSWQlMjIlM0ExNzYzNDk0Mjg4OTc3JTJDJTIyb3B0T3V0JTIyJTNBZmFsc2UlMkMlMjJsYXN0RXZlbnRUaW1lJTIyJTNBMTc2MzQ5NDMzNTU2NiUyQyUyMmxhc3RFdmVudElkJTIyJTNBNDYlMkMlMjJwYWdlQ291bnRlciUyMiUzQTclN0Q=; COFRE.AUTH=56e87365-063f-4ecd-8ee0-f23765022921; AbbaReport=Off; _cx.tracking.apikey=1c065310ebbb7dc39a79b506ddbf4d38; _cx.tracking.external_id_client=30977; _cx.tracking.email=faturamento@castelini.com.br; _cx.survey.status=no-survey-found; pys_start_session=true; pys_first_visit=true; pysTrafficSource=direct; pys_landing_page=https://www.sieg.com/; _clck=1efy5tx%5E2%5Eg1q%5E0%5E2007; _ga_D7RLJXG8ZV=GS2.1.s1765376418$o39$g0$t1765376418$j60$l0$h197100492; __trf.src=encoded_eyJmaXJzdF9zZXNzaW9uIjp7InZhbHVlIjoiKG5vbmUpIiwiZXh0cmFfcGFyYW1zIjp7fX0sImN1cnJlbnRfc2Vzc2lvbiI6eyJ2YWx1ZSI6Iihub25lKSIsImV4dHJhX3BhcmFtcyI6e319LCJjcmVhdGVkX2F0IjoxNzY1Mzc2NDE4ODI0fQ==; _ga_43W2WYML5H=GS2.1.s1765376419$o12$g0$t1765376419$j60$l0$h0; _ga=GA1.2.2014321285.1751282010; _gid=GA1.2.1034884867.1765376435; modalNps=4; _hjSession_3570950=eyJpZCI6IjA3M2EyZWUzLWQ0YmItNDYxMS04ODU2LTU4NGEzYWIzYjIxNiIsImMiOjE3NjUzOTEyNTk5NDMsInMiOjAsInIiOjAsInNiIjowLCJzciI6MCwic2UiOjAsImZzIjowLCJzcCI6MX0=; _ga_0XCNMGZ1WP=GS2.2.s1765393085$o35$g0$t1765393085$j60$l0$h0; _clsk=1lsqifl%5E1765393085269%5E3%5E1%5El.clarity.ms%2Fcollect; _BEAMER_FILTER_BY_URL_fxzWhwyU5092=false; AWSALB=WBLct5EBAEp8rICfg+HJsLCbYzwNyf0CpkZGUNcWgXXHRwSAn34SGetMfgx+B9U3zS2YtjaKfJI/uWvhi/cU1IWGOKNcZclbAdY0f5G8orXD41rF4ubpSSlEwI3J; AWSALBCORS=WBLct5EBAEp8rICfg+HJsLCbYzwNyf0CpkZGUNcWgXXHRwSAn34SGetMfgx+B9U3zS2YtjaKfJI/uWvhi/cU1IWGOKNcZclbAdY0f5G8orXD41rF4ubpSSlEwI3J",
            },
        }
    );

    const data = response.data;

    if (typeof data === "string" && /<\s*html/i.test(data)) {
        console.log(data);
        throw new Error("Sessão no SIEG expirada. Faça login novamente.");
    }

    const json = xmlToJson(data);
    const obj = json as INFeSiefCFOP;

    //Ajustando os CFOP
    return getCFOPsFromNFe(obj);
}
