export interface IPoint {
  x: number;
  y: number;

  isEqual: (other: IPoint) => boolean;
}
export class Point implements IPoint {
  x: number;
  y: number;
  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  isEqual(other: IPoint) {
    return this.x === other.x && this.y === other.y;
  };
}

export interface IEdge {
  start: IPoint;
  end: IPoint;
}
export class Edge implements IEdge {
  start: IPoint;
  end: IPoint;
  constructor(start: IPoint, end: IPoint) {
    this.start = start;
    this.end = end;
  }

  toString() {
    return `[(${this.start.x},${this.start.y})-(${this.end.x},${this.end.y})]`
  }
}

export interface IPolygon {
  points: IPoint[];

  getEdges: () => Edge[];
  mapEdge: (callback: (item: IEdge) => void) => void;
}
export class Polygon implements IPolygon {
  points: IPoint[];
  constructor(points: IPoint[]) {
    this.points = points;
  }

  getEdges() {
    const result: IEdge[] = [];
    for (let i = 0; i < this.points.length; i += 1) {
      result.push(new Edge(this.points[i], this.points[(i + 1) % this.points.length]));
    }
    return result;
  }

  mapEdge(callback: (item: IEdge) => void) {
    this.getEdges().map(callback);
  }
}

function isInRange(value: number, range: [number, number]) {
  const isMoreThanMin = value >= Math.min(...range);
  const isLessThanMax = value <= Math.max(...range);
  return isMoreThanMin && isLessThanMax;
}

function compareAndSwap(x: number, y: number) {
  return x <= y ? [x, y] : [y, x];
}

/**
 * 计算目标点所在的扫描线与多边形一边的交点
 * @param target 目标点
 * @param edge 多边形的边
 */
export function calcIntersectionOfScanlineAndEdge(target: IPoint, edge: IEdge): IPoint | [IPoint, IPoint] {
  const { start, end } = edge;

  if (!isInRange(target.y, [start.y, end.y])) {
    const [minY, maxY] = compareAndSwap(edge.start.y, edge.end.y);
    throw new Error(`目标点不在 ${edge} 的 y 轴投影[${minY}, ${maxY}]内`);
  }

  if (start.y === end.y && target.y === start.y) {
    // 如果 edge 平行于扫描线
    if (isInRange(target.x, [start.x, end.x])) {
      // 在 edge 内，返回 point
      return target;
    } else {
      // 不在 edge 内，返回两端点
      return [edge.start, edge.end];
    }
  }

  if (start.x === end.x) {
    return new Point(start.x, target.y);
  }

  // 两点式直线方程与扫描线求解交点
  const x = (target.y - end.y) * (start.x - end.x) / (start.y - end.y) + end.x;
  return new Point(x, target.y);
}

export function isOdd(num: number) {
  return num % 2 === 1;
}

export function pointInPolygon(target: IPoint, polygon: IPolygon): boolean {
  const leftIntersections: IPoint[] = [];
  const rightIntersections: IPoint[] = [];

  const pushPoint = (point: IPoint[]) => {
    const comparePoint: IPoint = point[0];
    if (comparePoint.x < target.x) {
      leftIntersections.push(...point);
    } else {
      rightIntersections.push(...point);
    }
  }

  for (const [index, item] of polygon.getEdges().entries()) {
    try {
      const intersection = calcIntersectionOfScanlineAndEdge(target, item);
      console.log(index, `与边 ${item} 有交点`, intersection);
      if (intersection instanceof Point) {
        if (intersection.isEqual(target)) {
          // 如果交点等于 target ，target 在 edge 上
          console.log('且该交点在边上');
          return true;
        } else {
          // 唯一交点推入交点集
          pushPoint([intersection]);
        }
      } else if (Array.isArray(intersection)) {
        // edge 端点推入交点集
        pushPoint(intersection);
      }
    } catch (err) {
      console.log(index, err.message);
    }
  };
  console.log('leftIntersections.length', leftIntersections.length);
  console.log('rightIntersections.legnth', rightIntersections.length);

  return isOdd(leftIntersections.length) && isOdd(rightIntersections.length);
}
