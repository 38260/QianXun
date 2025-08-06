import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
    try {
        // 读取后端result文件夹
        const resultDir = path.join(process.cwd(), 'backEnd', 'result');
        
        // 检查目录是否存在
        if (!fs.existsSync(resultDir)) {
            return NextResponse.json(
                { error: '热点数据目录不存在' },
                { status: 404 }
            );
        }

        // 获取所有json文件
        const files = fs.readdirSync(resultDir)
            .filter(file => file.endsWith('.json'))
            .sort()
            .reverse(); // 最新的文件在前

        if (files.length === 0) {
            return NextResponse.json(
                { error: '没有找到热点数据文件' },
                { status: 404 }
            );
        }

        // 读取最新的文件
        const latestFile = files[0];
        const filePath = path.join(resultDir, latestFile);
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        const data = JSON.parse(fileContent);

        return NextResponse.json(data);
    } catch (error) {
        console.error('读取热点数据失败:', error);
        return NextResponse.json(
            { error: '读取热点数据失败' },
            { status: 500 }
        );
    }
} 