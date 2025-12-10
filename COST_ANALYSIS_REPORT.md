# Cost Analysis Report
## Cloud-Based Ticketing Application

**Project:** Tugas Besar Cloud Computing  
**Date:** December 10, 2025  
**Version:** 1.0

---

## Executive Summary

This cost analysis report provides a comprehensive breakdown of the infrastructure costs for deploying and operating a cloud-based event ticketing application. The application consists of a React frontend, Node.js/Express backend, PostgreSQL database, and Firebase Authentication services.

### Key Findings:
- **Estimated Monthly Cost (AWS):** $45 - $150 (development to production)
- **Estimated Monthly Cost (GCP):** $40 - $140 (development to production)
- **Estimated Monthly Cost (Azure):** $50 - $160 (development to production)
- **Cost Optimization Potential:** 30-40% through reserved instances and auto-scaling

---

## Table of Contents

1. [Application Architecture](#application-architecture)
2. [Infrastructure Components](#infrastructure-components)
3. [Cloud Provider Cost Analysis](#cloud-provider-cost-analysis)
4. [Cost Breakdown by Service](#cost-breakdown-by-service)
5. [Scaling Scenarios](#scaling-scenarios)
6. [Cost Optimization Strategies](#cost-optimization-strategies)
7. [ROI Analysis](#roi-analysis)
8. [Recommendations](#recommendations)

---

## 1. Application Architecture

### Technology Stack
- **Frontend:** React 19.2.0, React Router, Axios
- **Backend:** Node.js, Express 5.1.0
- **Database:** PostgreSQL 15
- **Authentication:** Firebase Authentication, JWT
- **Containerization:** Docker, Docker Compose
- **Storage:** Firebase Storage (for event posters)

### Architecture Components
```
┌─────────────────┐
│   Users/Buyers  │
└────────┬────────┘
         │
    ┌────▼─────┐
    │ Frontend │ (React - Port 3000)
    │ Container│
    └────┬─────┘
         │
    ┌────▼─────┐
    │ Backend  │ (Node.js - Port 8080)
    │ Container│
    └────┬─────┘
         │
    ┌────▼─────────┐
    │  PostgreSQL  │ (Port 5432)
    │   Database   │
    └──────────────┘
         │
    ┌────▼─────────┐
    │   Firebase   │
    │ Auth/Storage │
    └──────────────┘
```

---

## 2. Infrastructure Components

### 2.1 Compute Resources

#### Frontend Container
- **CPU:** 0.5 vCPU
- **Memory:** 512 MB - 1 GB
- **Instances:** 1-3 (with load balancing)
- **Purpose:** Serve React application (nginx/Apache)

#### Backend Container
- **CPU:** 1 vCPU
- **Memory:** 1-2 GB
- **Instances:** 1-4 (with load balancing)
- **Purpose:** REST API, business logic

### 2.2 Database
- **PostgreSQL 15**
- **Storage:** 20-100 GB (SSD)
- **CPU:** 1-2 vCPU
- **Memory:** 2-4 GB
- **Backup:** Daily automated backups (7-day retention)

### 2.3 Storage
- **Event Posters:** Firebase Storage
- **Database Storage:** 20-100 GB
- **Logs:** 5-10 GB
- **Backups:** 50-200 GB

### 2.4 Networking
- **Load Balancer:** 1 Application Load Balancer
- **Data Transfer:** 100 GB - 1 TB/month
- **CDN:** Optional for static assets

### 2.5 Third-Party Services
- **Firebase Authentication:** Free tier up to 10,000 MAU
- **Firebase Storage:** 5 GB free, $0.026/GB after
- **Domain & SSL:** $12-15/year

---

## 3. Cloud Provider Cost Analysis

### 3.1 Amazon Web Services (AWS)

#### Development Environment (~$45/month)
| Service | Specification | Cost |
|---------|--------------|------|
| EC2 (Frontend) | t3.micro (1 instance) | $7.50 |
| EC2 (Backend) | t3.small (1 instance) | $15.00 |
| RDS PostgreSQL | db.t3.micro (20 GB) | $13.00 |
| S3 Storage | 5 GB | $0.12 |
| Data Transfer | 50 GB outbound | $4.50 |
| Load Balancer | ALB (minimal traffic) | $16.20 |
| **Total** | | **~$56.32/month** |

#### Production Environment (~$150/month)
| Service | Specification | Cost |
|---------|--------------|------|
| EC2 (Frontend) | t3.small (2 instances) | $30.00 |
| EC2 (Backend) | t3.medium (2 instances) | $67.20 |
| RDS PostgreSQL | db.t3.small (50 GB) | $40.00 |
| S3 Storage | 50 GB | $1.15 |
| Data Transfer | 500 GB outbound | $45.00 |
| Load Balancer | ALB | $16.20 |
| CloudWatch Logs | 10 GB | $5.00 |
| Route 53 | Hosted zone + queries | $1.00 |
| Backup Storage | 100 GB | $5.00 |
| **Total** | | **~$210.55/month** |

#### Reserved Instance (1-year) Savings
- **EC2 Savings:** ~40% ($38.88 saved/month)
- **RDS Savings:** ~35% ($14 saved/month)
- **Total with RI:** ~$158/month

---

### 3.2 Google Cloud Platform (GCP)

#### Development Environment (~$40/month)
| Service | Specification | Cost |
|---------|--------------|------|
| Compute Engine (Frontend) | e2-micro (1 instance) | $6.11 |
| Compute Engine (Backend) | e2-small (1 instance) | $12.22 |
| Cloud SQL PostgreSQL | db-f1-micro (20 GB) | $9.37 |
| Cloud Storage | 5 GB | $0.10 |
| Data Transfer | 50 GB egress | $6.00 |
| Load Balancer | HTTP(S) LB | $18.00 |
| **Total** | | **~$51.80/month** |

#### Production Environment (~$140/month)
| Service | Specification | Cost |
|---------|--------------|------|
| Compute Engine (Frontend) | e2-small (2 instances) | $24.44 |
| Compute Engine (Backend) | e2-medium (2 instances) | $48.88 |
| Cloud SQL PostgreSQL | db-g1-small (50 GB) | $38.35 |
| Cloud Storage | 50 GB | $1.00 |
| Data Transfer | 500 GB egress | $60.00 |
| Load Balancer | HTTP(S) LB | $18.00 |
| Cloud Logging | 10 GB | $5.00 |
| Backup Storage | 100 GB nearline | $4.00 |
| **Total** | | **~$199.67/month** |

#### Committed Use Discount (1-year)
- **Compute Savings:** ~37% ($27 saved/month)
- **Total with CUD:** ~$172/month

---

### 3.3 Microsoft Azure

#### Development Environment (~$50/month)
| Service | Specification | Cost |
|---------|--------------|------|
| VM (Frontend) | B1s (1 instance) | $7.59 |
| VM (Backend) | B2s (1 instance) | $30.37 |
| Azure Database PostgreSQL | Basic 1 vCore (20 GB) | $24.82 |
| Blob Storage | 5 GB | $0.10 |
| Data Transfer | 50 GB outbound | $4.30 |
| Load Balancer | Basic | $18.00 |
| **Total** | | **~$85.18/month** |

#### Production Environment (~$160/month)
| Service | Specification | Cost |
|---------|--------------|------|
| VM (Frontend) | B2s (2 instances) | $60.74 |
| VM (Backend) | B4ms (2 instances) | $121.48 |
| Azure Database PostgreSQL | GP 2 vCores (50 GB) | $103.01 |
| Blob Storage | 50 GB | $1.00 |
| Data Transfer | 500 GB outbound | $43.00 |
| Load Balancer | Standard | $18.00 |
| Log Analytics | 10 GB | $2.30 |
| Backup Storage | 100 GB | $10.00 |
| **Total** | | **~$359.53/month** |

#### Reserved VM Instances (1-year)
- **VM Savings:** ~40% ($72.88 saved/month)
- **Total with RVI:** ~$286/month

---

## 4. Cost Breakdown by Service

### 4.1 Compute (40-45% of total cost)
- Frontend hosting: $15-40/month
- Backend API servers: $30-100/month
- Auto-scaling buffer: $10-30/month

### 4.2 Database (25-30% of total cost)
- PostgreSQL instance: $25-80/month
- Storage: $5-20/month
- Backup: $5-15/month
- IOPS: Included in instance cost

### 4.3 Storage (5-10% of total cost)
- Firebase Storage: $0-5/month (free tier covers most use cases)
- Additional blob storage: $2-10/month
- Log storage: $2-5/month

### 4.4 Network (15-20% of total cost)
- Load balancer: $16-20/month
- Data transfer (egress): $20-60/month
- CDN (optional): $10-30/month

### 4.5 Monitoring & Logging (3-5% of total cost)
- Application logs: $3-8/month
- Metrics & monitoring: $2-5/month
- Alerting: $1-3/month

### 4.6 Third-Party Services (5-10% of total cost)
- Firebase Authentication: $0-25/month
- Firebase Storage: $0-10/month
- Domain & DNS: $1-3/month

---

## 5. Scaling Scenarios

### 5.1 Low Traffic (< 10,000 users/month)
**Estimated Cost:** $50-70/month
- 1 frontend instance
- 1 backend instance
- Minimal database tier
- Basic monitoring
- **User Capacity:** ~10,000 MAU, ~100 concurrent users

### 5.2 Medium Traffic (10,000 - 100,000 users/month)
**Estimated Cost:** $150-200/month
- 2 frontend instances
- 2-3 backend instances
- Standard database tier
- Enhanced monitoring
- **User Capacity:** ~100,000 MAU, ~1,000 concurrent users

### 5.3 High Traffic (100,000 - 500,000 users/month)
**Estimated Cost:** $400-600/month
- 3-5 frontend instances (auto-scaling)
- 4-8 backend instances (auto-scaling)
- High-availability database (multi-AZ)
- CDN for static assets
- Advanced monitoring & alerting
- **User Capacity:** ~500,000 MAU, ~5,000 concurrent users

### 5.4 Peak Event Traffic (Temporary Spikes)
**Estimated Additional Cost:** $50-150 during peak hours
- Auto-scaling to 2-3x normal capacity
- Increased database connections
- CDN burst capacity
- **Duration:** Typically 2-6 hours during major event launches

---

## 6. Cost Optimization Strategies

### 6.1 Immediate Optimizations (0-3 months)

#### 1. Right-Sizing Instances
- **Action:** Monitor CPU/memory usage and downsize underutilized instances
- **Potential Savings:** 20-30% on compute costs
- **Implementation:** Use cloud provider monitoring tools

#### 2. Reserved Instances / Committed Use
- **Action:** Commit to 1-year reserved instances for predictable workloads
- **Potential Savings:** 35-40% on compute and database
- **ROI Timeline:** 6-8 months

#### 3. Auto-Scaling Configuration
- **Action:** Implement time-based and metric-based auto-scaling
- **Potential Savings:** 15-25% during off-peak hours
- **Implementation:** Scale down to 1 instance during nights/weekends

#### 4. Database Optimization
- **Action:** Implement connection pooling, query optimization, indexing
- **Potential Savings:** 10-15% on database tier requirements
- **Implementation:** Review slow query logs, add appropriate indexes

### 6.2 Medium-Term Optimizations (3-6 months)

#### 5. CDN Implementation
- **Action:** Use CloudFront/Cloud CDN for static assets
- **Cost Impact:** +$10-20/month, saves $30-50/month on compute
- **Net Savings:** $20-30/month
- **Benefit:** Improved performance and reduced origin server load

#### 6. Caching Strategy
- **Action:** Implement Redis/Memcached for session and data caching
- **Cost Impact:** +$15-25/month for cache instance
- **Savings:** Reduces database queries by 40-60%, allows smaller DB tier
- **Net Savings:** $20-40/month

#### 7. Storage Lifecycle Policies
- **Action:** Move old backups to cold storage, delete old logs
- **Potential Savings:** 30-50% on storage costs
- **Implementation:** Automated lifecycle rules

#### 8. Containerization Optimization
- **Action:** Use smaller base images, multi-stage builds
- **Potential Savings:** 10-20% on storage and transfer costs
- **Implementation:** Optimize Dockerfiles

### 6.3 Long-Term Optimizations (6-12 months)

#### 9. Serverless Migration (Optional)
- **Action:** Migrate low-frequency endpoints to serverless functions
- **Potential Savings:** 25-40% for specific workloads
- **Considerations:** Requires code refactoring

#### 10. Multi-Region Strategy (for global reach)
- **Action:** Deploy to multiple regions with geo-routing
- **Cost Impact:** +50-100% infrastructure cost
- **Benefit:** Reduced latency, better user experience, disaster recovery

#### 11. Database Read Replicas
- **Action:** Add read replicas for read-heavy workloads
- **Cost Impact:** +30-50% database cost
- **Benefit:** Improved performance, horizontal scaling
- **When to Implement:** When read queries > 70% of total DB load

---

## 7. ROI Analysis

### 7.1 Cost per User

| Traffic Level | Monthly Cost | Active Users | Cost per User |
|---------------|--------------|--------------|---------------|
| Low | $60 | 5,000 | $0.012 |
| Medium | $180 | 50,000 | $0.0036 |
| High | $500 | 250,000 | $0.002 |

### 7.2 Revenue Model Assumptions

#### Scenario A: Service Fee Model
- **Transaction Fee:** 5% per ticket sale
- **Average Ticket Price:** $25
- **Average Transactions/User/Month:** 0.5
- **Revenue per User:** $0.625
- **Break-even Users:** ~300 users (low tier), ~600 users (medium tier)

#### Scenario B: Subscription Model
- **Promoter Subscription:** $29/month per promoter
- **Average Events per Promoter:** 3/month
- **Required Promoters for Break-even:** 
  - Low tier: 2 promoters
  - Medium tier: 7 promoters

### 7.3 Profitability Timeline

| Month | Users | Revenue | Infrastructure Cost | Net Profit |
|-------|-------|---------|---------------------|------------|
| 1 | 2,000 | $1,250 | $60 | $1,190 |
| 3 | 10,000 | $6,250 | $120 | $6,130 |
| 6 | 40,000 | $25,000 | $180 | $24,820 |
| 12 | 150,000 | $93,750 | $450 | $93,300 |

**Assumptions:** 5% transaction fee, $25 avg ticket, 0.5 transactions/user/month

### 7.4 Total Cost of Ownership (TCO) - Year 1

| Cost Category | Amount |
|---------------|--------|
| Infrastructure (monthly avg) | $2,160 |
| Development/Maintenance | $0 (self-developed) |
| Third-party services | $300 |
| Domain & SSL | $50 |
| Monitoring tools | $200 |
| **Total Annual TCO** | **$2,710** |

---

## 8. Recommendations

### 8.1 Immediate Actions (Week 1-2)

1. **Deploy on GCP for Best Value**
   - Lowest entry cost ($40-50/month for dev environment)
   - Good documentation and Firebase integration
   - Excellent free tier

2. **Implement Basic Monitoring**
   - Set up CloudWatch/Cloud Monitoring
   - Configure alerts for high CPU, memory, errors
   - Cost: $5-10/month

3. **Enable Auto-Backups**
   - Database: Daily backups with 7-day retention
   - Configuration: Store in version control

### 8.2 Short-Term Actions (Month 1-3)

4. **Set Up Auto-Scaling**
   - Minimum 1 instance per service
   - Maximum 3 instances per service
   - Scale on CPU > 70% or memory > 80%

5. **Implement Connection Pooling**
   - Configure pg pool in backend
   - Reduces database connections
   - No additional cost, improves performance

6. **Add CDN (CloudFlare Free Tier)**
   - Free tier available
   - Reduces egress costs
   - Improves global performance

7. **Purchase Reserved Instances**
   - After establishing baseline usage (month 2-3)
   - 1-year commitment for 35-40% savings
   - ROI: 6-8 months

### 8.3 Medium-Term Actions (Month 3-6)

8. **Implement Redis Caching**
   - Cache event listings, user sessions
   - Cost: $15-25/month
   - Savings: $30-50/month in database costs

9. **Optimize Docker Images**
   - Use multi-stage builds
   - Alpine-based images
   - Reduce image size by 50-70%

10. **Set Up CI/CD Pipeline**
    - GitHub Actions (free for public repos)
    - Automated testing and deployment
    - Reduces manual errors

### 8.4 Long-Term Considerations (Month 6-12)

11. **Consider Database Migration**
    - If query patterns are simple, consider managed services
    - Firebase Firestore for document storage
    - PostgreSQL for transactional data

12. **Implement Comprehensive Monitoring**
    - APM tools (New Relic, DataDog)
    - Cost: $50-100/month
    - Benefit: Proactive issue detection

13. **Disaster Recovery Plan**
    - Multi-region backup
    - Documented recovery procedures
    - Cost: +$20-30/month

### 8.5 Cost Targets by Quarter

| Quarter | Target Monthly Cost | Target Users | Target Cost/User |
|---------|---------------------|--------------|------------------|
| Q1 | $50-80 | 10,000 | $0.005-0.008 |
| Q2 | $120-150 | 50,000 | $0.0024-0.003 |
| Q3 | $250-300 | 150,000 | $0.0017-0.002 |
| Q4 | $400-500 | 300,000 | $0.0013-0.0017 |

---

## 9. Risk Analysis

### 9.1 Cost Overrun Risks

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Viral growth spike | Medium | High | Auto-scaling with max limits |
| DDoS attack | Low | High | CloudFlare/WAF protection |
| Database scaling issues | Medium | Medium | Read replicas, connection pooling |
| Data egress costs | High | Medium | CDN, optimize API responses |
| Firebase quota exceeded | Low | Low | Monitor usage, upgrade tier |

### 9.2 Cost Control Measures

1. **Budget Alerts**
   - Set alerts at 50%, 75%, 90% of monthly budget
   - Configure email/SMS notifications

2. **Auto-Scaling Limits**
   - Maximum instances: 5 per service
   - Prevents runaway costs during attacks

3. **Monthly Review Process**
   - Review cost reports weekly
   - Identify anomalies and optimize

4. **Kill Switch**
   - Ability to quickly scale down or pause services
   - Emergency cost control measure

---

## 10. Conclusion

### Key Takeaways

1. **Starting Cost:** The application can be deployed for as low as $40-60/month in development environment

2. **Production Ready:** A production environment with proper monitoring, backups, and scaling can be operated for $150-200/month

3. **Scalability:** The architecture can efficiently scale to support 100,000+ monthly active users within a $500/month budget

4. **Optimization Potential:** Through reserved instances, caching, and CDN implementation, costs can be reduced by 30-40%

5. **Best Cloud Provider for This Use Case:**
   - **Development:** GCP (lowest cost, Firebase integration)
   - **Production:** AWS or GCP (depending on team familiarity)
   - **Enterprise:** AWS (most mature services and tools)

### Final Recommendation

**Phase 1 (Month 0-3): Start Lean**
- Deploy on GCP free tier initially
- Monthly cost: $0-50
- Focus on user acquisition

**Phase 2 (Month 3-6): Optimize & Scale**
- Migrate to paid tier with reserved instances
- Implement caching and CDN
- Monthly cost: $100-150
- Target: 25,000-50,000 users

**Phase 3 (Month 6-12): Production Ready**
- High-availability setup
- Multi-region consideration
- Advanced monitoring
- Monthly cost: $300-500
- Target: 100,000-250,000 users

### Expected ROI

With a 5% transaction fee model and average ticket price of $25:
- **Break-even:** 300-600 users
- **Profitable at:** 1,000+ users
- **Year 1 Projection:** $90,000+ net profit (assuming 150,000 MAU)

---

## Appendix

### A. Cost Calculation Tools
- AWS Pricing Calculator: https://calculator.aws
- GCP Pricing Calculator: https://cloud.google.com/products/calculator
- Azure Pricing Calculator: https://azure.microsoft.com/pricing/calculator

### B. Monitoring Resources
- CloudWatch Dashboard Templates
- Grafana Dashboard for PostgreSQL
- Cost Monitoring Dashboard Templates

### C. Optimization Guides
- Docker Image Optimization Guide
- PostgreSQL Performance Tuning
- Node.js Production Best Practices

### D. Contact Information
For questions regarding this cost analysis, please contact the DevOps team.

---

**Document Version:** 1.0  
**Last Updated:** December 10, 2025  
**Next Review:** March 10, 2026
