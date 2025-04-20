import { useState, useEffect } from "react";

export type DomainStatus = {
  domain: string;
  isBlocked: boolean;
  statusCode?: number | null;
  icpBlocked?: boolean;
  dnsBlocked?: boolean;
  whoisBlocked?: boolean;
  errorMessage?: string;
};

/**
 * **检测域名是否被监管**
 * @param domain 需要检测的域名
 * @returns {DomainStatus} 详细的域名状态
 */
export const useDomainCheck = (domain: string) => {
  const [status, setStatus] = useState<DomainStatus>({
    domain,
    isBlocked: false,
    statusCode: null,
    icpBlocked: false,
    dnsBlocked: false,
    whoisBlocked: false,
    errorMessage: "",
  });

  useEffect(() => {
    const checkDomainStatus = async () => {
      const result: DomainStatus = { ...status };

      try {
        // ✅ 访问测试：使用 `fetch()` 并检测 `response.status`
        const response = await fetch(`https://${domain}`, { method: "GET", mode: "cors" });

        if (response.status >= 200 && response.status < 400) {
          result.statusCode = response.status;
          result.isBlocked = false;
        } else {
          result.isBlocked = true;
        }
      } catch (error) {
        result.isBlocked = true;
        result.errorMessage = `无法访问 ${domain}: ${error}`;
      }

      try {
        // ✅ 查询 ICP 备案
        const icpResponse = await fetch(`https://beian.miit.gov.cn/api/query?domain=${domain}`);
        const icpData = await icpResponse.json();
        result.icpBlocked = icpData?.isBlocked ?? false;
      } catch {}

      try {
        // ✅ 解析 DNS（优化国内域名）
        const dnsResponse = await fetch(`https://1.1.1.1/dns-query?name=${domain}&type=A`);
        const dnsData = await dnsResponse.json();
        result.dnsBlocked = !dnsData?.Answer;
      } catch {}

      try {
        // ✅ 获取 WHOIS 信息
        const whoisResponse = await fetch(`https://whois.example.com/api/query?domain=${domain}`);
        const whoisData = await whoisResponse.json();
        result.whoisBlocked = whoisData?.isBlocked ?? false;
      } catch {}

      setStatus(result);
    };

    checkDomainStatus();
  }, [domain]);

  return status;
};
