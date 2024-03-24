import React from 'react';
import styled from 'styled-components';

// Componentes estilizados para mejorar la UI
const Container = styled.div`
  max-width: 800px;
  margin: 20px auto;
  font-family: Arial, sans-serif;
`;

const Title = styled.h3`
  text-align: center;
  color: #333;
`;

const TaxStateSection = styled.div`
  margin-bottom: 40px;
`;

const TaxStateTitle = styled.h4`
  text-align: center;
  color: #666;
`;

const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin: 0 auto;
`;

const TableHeader = styled.th`
  background-color: #f4f4f4;
  color: #333;
  padding: 10px 0;
`;

const TableRow = styled.tr`
  text-align: center;
  border-bottom: 1px solid #ddd;

  &:nth-child(even) {
    background-color: #f9f9f9;
  }
`;

const TableCell = styled.td`
  padding: 10px 0;
`;

// Corrección de los cálculos
const AgentBenefits = ({ price }) => {
    const taxStates =
        { IRPFRate: 0.30, VATRate: 0.21 }
    ;

    const captorCommissionRate = 0.05; // 5% de los honorarios del agente

    const calculateBenefits = (honorariosRate, VATRate, IRPFRate) => {
        const minimumCommission = 3000;
        let agentHonorarios = price * honorariosRate;
        if (agentHonorarios < minimumCommission) {
            agentHonorarios = minimumCommission;
        }

        const agentHonorariosWithVAT = agentHonorarios * (1 + VATRate);
        const agentHonorariosAfterIRPF = agentHonorarios * (1 - IRPFRate);
        const captorCommission = agentHonorarios * captorCommissionRate;

        // El beneficio neto del agente debería considerar tanto el IRPF como el IVA si aplica
        const netBenefit = agentHonorariosAfterIRPF;

        return {
            agentNetBenefit: netBenefit,
            agentHonorarios: agentHonorarios,
            agentHonorariosWithVAT: agentHonorariosWithVAT, // Mostrar honorarios con IVA si aplica
            captorCommission,
        };
    };

    return (
        <Container>
            <Title>Resumen de Beneficios</Title>
                    <table>
                        <thead>
                        <tr>
                            <TableHeader>Tasa</TableHeader>
                            <TableHeader>B.N.</TableHeader>
                            <TableHeader>Honorarios</TableHeader>
                            <TableHeader>Con IVA</TableHeader>
                            <TableHeader>Captador</TableHeader>
                        </tr>
                        </thead>
                        <tbody>
                        {[0.03, 0.04, 0.05, 0.06].map((honorariosRate, index) => {
                            const { agentNetBenefit, agentHonorarios, agentHonorariosWithVAT,captorCommission } = calculateBenefits(honorariosRate, taxStates.VATRate, taxStates.IRPFRate);
                            return (
                                <tr key={index}>
                                    <td>{(honorariosRate * 100).toFixed(2)}%</td>
                                    <td>€{agentNetBenefit.toLocaleString()}</td>

                                    <td>€{agentHonorarios.toLocaleString()}</td>
                                    <td>€{(agentHonorariosWithVAT).toLocaleString()}</td>

                                    <td>€{captorCommission.toLocaleString()}</td>
                                </tr>
                            );
                        })}
                        </tbody>
                    </table>
        </Container>
    );
};

export default AgentBenefits;
